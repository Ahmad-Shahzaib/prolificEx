"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Clock,
  Star,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createOffer, fetchMyOffers, fetchOffers, P2POffer } from "@/redux/thunk/p2pOffersThunk";
import { initiateP2POrder } from "@/redux/thunk/p2pOrderThunk";
import { fetchExchangeRate } from "@/redux/thunk/exchangeRateThunk";
import { fetchP2PPaymentMethods } from "@/redux/thunk/p2pPaymentMethodsThunk";
import { clearP2POrderState } from "@/redux/slices/p2pOrderSlice";
import { fetchWallets } from "@/redux/thunk/walletThunk";
import { fetchKycStatus } from "@/redux/thunk/kycThunk";
import { Toaster } from "@/components/common/Toast";
import { useToast } from "@/hooks/use-toast";
const COINS = ["USDT", "BTC", "ETH", "BNB", "USDC"];
const COIN_FILTERS = ["All", ...COINS];
const NETWORKS = ["TRC20", "ERC20", "BEP20"];
const DEFAULT_PAYMENT_METHODS_BY_FIAT: Record<string, string[]> = {
  USD: ["bank_transfer", "international_bank"],
  NGN: ["nigerian_bank", "opay", "palmpay", "moniepoint", "kuda_bank"],
};
const PRICE_TYPES = ["fixed"];
const DEFAULT_FIAT_CURRENCIES = ["USD", "NGN"];
const RATINGS = ["All", "5 Stars", "4+ Stars", "3+ Stars"];
const ACCOUNT_NAME_PATTERN = /^[a-zA-Z\s.'-]+$/;

const PAGE_SIZE = 9;
const ALLOWED_PAYMENT_METHODS = new Set(Object.values(DEFAULT_PAYMENT_METHODS_BY_FIAT).flat());
const cleanAccountName = (value: string) => value.replace(/[^a-zA-Z\s.'-]/g, "");

const formatPaymentMethod = (method: string) =>
  method
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const normalizePaymentMethodValue = (method: string) => method.trim().toLowerCase().replace(/\s+/g, "_");

const getOfferCrypto = (offer: P2POffer) => offer.crypto_currency || offer.coin || "USDT";
const getOfferPrice = (offer: P2POffer) => Number(offer.price || offer.price_per_coin || 0);
const getOfferPaymentMethods = (offer: P2POffer) =>
  offer.payment_methods?.length ? offer.payment_methods : offer.payment_method ? [offer.payment_method] : [];
const getOfferAvailablePercent = (offer: P2POffer) => {
  const amount = Number(offer.amount || offer.available_amount || 0);
  const available = Number(offer.available_amount || 0);
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(available)) return 0;
  return Math.max(8, Math.min(100, Math.round((available / amount) * 100)));
};

const formatFiatAmount = (amount: string | number, fiatCurrency: string) =>
  `${fiatCurrency} ${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const normalizeFiatCurrencyResponse = (payload: any) => {
  const rawCurrencies = payload?.data?.fiat_currencies ?? payload?.data?.currencies ?? payload?.data ?? payload;
  const paymentMethodsByFiat: Record<string, string[]> = {};
  const fiatCurrencies: string[] = [];
  const normalizeCurrencyCode = (item: any) => {
    const rawCode =
      typeof item === "string"
        ? item
        : item?.code ?? item?.currency ?? item?.fiat_currency ?? item?.value ?? "";
    const code = String(rawCode).toUpperCase();
    return DEFAULT_FIAT_CURRENCIES.includes(code) ? code : "";
  };
  const normalizePaymentMethod = (method: any) => {
    const rawMethod =
      typeof method === "string"
        ? method
        : method?.key ?? method?.value ?? method?.code ?? method?.slug ?? method?.payment_method ?? "";
    const value = String(rawMethod).toLowerCase();
    return ALLOWED_PAYMENT_METHODS.has(value) ? value : "";
  };

  if (Array.isArray(rawCurrencies)) {
    rawCurrencies.forEach((item) => {
      const code = normalizeCurrencyCode(item);
      if (!code) return;
      fiatCurrencies.push(code);
      const methods = item?.payment_methods ?? item?.paymentMethods ?? item?.methods;
      if (Array.isArray(methods)) {
        paymentMethodsByFiat[code] = methods.map(normalizePaymentMethod).filter(Boolean);
      }
    });
  } else if (rawCurrencies && typeof rawCurrencies === "object") {
    Object.entries(rawCurrencies).forEach(([code, value]) => {
      const normalizedCode = code.toUpperCase();
      if (!DEFAULT_FIAT_CURRENCIES.includes(normalizedCode)) return;
      fiatCurrencies.push(normalizedCode);
      const methods = Array.isArray(value)
        ? value
        : (value as any)?.payment_methods ?? (value as any)?.paymentMethods ?? (value as any)?.methods ?? [];
      paymentMethodsByFiat[normalizedCode] = Array.isArray(methods)
        ? methods.map(normalizePaymentMethod).filter(Boolean)
        : [];
    });
  }

  DEFAULT_FIAT_CURRENCIES.forEach((code) => {
    if (!paymentMethodsByFiat[code]?.length) {
      paymentMethodsByFiat[code] = DEFAULT_PAYMENT_METHODS_BY_FIAT[code];
    }
  });

  const cleanFiatCurrencies = DEFAULT_FIAT_CURRENCIES.filter((code) => new Set(fiatCurrencies).has(code));

  return {
    fiatCurrencies: cleanFiatCurrencies.length ? cleanFiatCurrencies : DEFAULT_FIAT_CURRENCIES,
    paymentMethodsByFiat: Object.keys(paymentMethodsByFiat).length
      ? paymentMethodsByFiat
      : DEFAULT_PAYMENT_METHODS_BY_FIAT,
  };
};

const getMerchantUserRating = (offer: P2POffer) => {
  const rating = Number(offer.user?.rating ?? offer.trader_rating ?? 0);

  if (!Number.isFinite(rating)) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(rating)));
};

export default function P2PCryptoTable() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toasts, toast, dismiss } = useToast();
  const {
    offers,
    offersLoading,
    offersError,
    myOffers,
    loading,
    error,
    creating,
    createError,
    createSuccessMessage,
  } = useAppSelector((state) => state.p2pOffers);

  const { totalPortfolioUsd, loading: walletLoading } = useAppSelector((state) => state.wallet);
  const { status: kycStatus, statusLoading: kycStatusLoading } = useAppSelector((state) => state.kyc);
  const {
    loading: orderLoading,
    error: orderError,
    order: orderResult,
    successMessage: orderSuccessMessage,
  } = useAppSelector((state) => state.p2pOrder);
  const {
    methods: apiPaymentMethods,
    loading: paymentMethodsLoading,
  } = useAppSelector((state) => state.p2pPaymentMethods);
  const kycRequiredErrorText = `${offersError || ""} ${error || ""} ${createError || ""}`.toLowerCase();

  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [fiatCurrencies, setFiatCurrencies] = useState(DEFAULT_FIAT_CURRENCIES);
  const [paymentMethodsByFiat, setPaymentMethodsByFiat] = useState(DEFAULT_PAYMENT_METHODS_BY_FIAT);
  const [selectedCoinFilter, setSelectedCoinFilter] = useState("All");
  const [coin, setCoin] = useState("USDT");
  const [searchQuery, setSearchQuery] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOrderOffer, setSelectedOrderOffer] = useState<P2POffer | null>(null);
  const [orderAmount, setOrderAmount] = useState("");
  const [orderPaymentMethod, setOrderPaymentMethod] = useState("");
  const [orderBankName, setOrderBankName] = useState("");
  const [orderAccountName, setOrderAccountName] = useState("");
  const [orderAccountNumber, setOrderAccountNumber] = useState("");
  const [orderIbanNumber, setOrderIbanNumber] = useState("");
  const [orderInstructions, setOrderInstructions] = useState("Send exact amount. Include order number in reference.");
  const [network, setNetwork] = useState("TRC20");
  const [minOrderLimit, setMinOrderLimit] = useState("100");
  const [maxOrderLimit, setMaxOrderLimit] = useState("2000");
  const [pricePerCoin, setPricePerCoin] = useState("1.01");
  const [priceType, setPriceType] = useState("fixed");
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHODS_BY_FIAT.USD[0]);
  const [paymentWindow, setPaymentWindow] = useState("15");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ibanNumber, setIbanNumber] = useState("");
  const [instructions, setInstructions] = useState("Send exact amount. Include order number in reference.");

  // Refs for dropdown click-outside detection
  const coinDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const paymentMethodOptions = useMemo(
    () =>
      apiPaymentMethods.length
        ? apiPaymentMethods.map((method) => ({ label: method.name, value: method.slug }))
        : (paymentMethodsByFiat[fiatCurrency] ?? DEFAULT_PAYMENT_METHODS_BY_FIAT[fiatCurrency] ?? []).map((method) => ({
            label: formatPaymentMethod(method),
            value: method,
          })),
    [apiPaymentMethods, fiatCurrency, paymentMethodsByFiat]
  );
  const paymentMethods = useMemo(
    () => ["All", ...paymentMethodOptions.map((method) => method.value)],
    [paymentMethodOptions]
  );

  useEffect(() => {
    dispatch(fetchMyOffers());
    dispatch(fetchWallets());
    dispatch(fetchKycStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!fiatCurrency) return;
    dispatch(fetchP2PPaymentMethods({ fiat_currency: fiatCurrency }));
  }, [dispatch, fiatCurrency]);

  useEffect(() => {
    if (!fiatCurrency) return;

    let isCurrent = true;
    dispatch(fetchExchangeRate({ base: "USD", target: fiatCurrency }))
      .unwrap()
      .then((result) => {
        if (!isCurrent) return;
        setPricePerCoin(String(result.rate));
      })
      .catch(() => {
        if (!isCurrent || fiatCurrency !== "USD") return;
        setPricePerCoin("1");
      });

    return () => {
      isCurrent = false;
    };
  }, [dispatch, fiatCurrency]);

  useEffect(() => {
    if (!paymentMethodOptions.length) return;
    if (!paymentMethodOptions.some((method) => method.value === paymentMethod)) {
      setPaymentMethod(paymentMethodOptions[0].value);
      setBankName(paymentMethodOptions[0].label);
    }
  }, [paymentMethod, paymentMethodOptions]);

  useEffect(() => {
    if (!kycStatusLoading && kycStatus && kycStatus !== "approved") {
      router.push("/dashboard/kyc");
    }
  }, [kycStatus, kycStatusLoading, router]);

  useEffect(() => {
    if (
      kycRequiredErrorText.includes("kyc verification is required") ||
      kycRequiredErrorText.includes("kyc required")
    ) {
      router.push("/dashboard/kyc");
    }
  }, [kycRequiredErrorText, router]);

  useEffect(() => {
    const loadFiatCurrencies = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        if (!baseUrl) return;

        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        const response = await fetch(`${baseUrl}/p2p/fiat-currencies`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await response.json();
        if (!response.ok || data?.success === false) return;

        const normalized = normalizeFiatCurrencyResponse(data);
        setFiatCurrencies(normalized.fiatCurrencies);
        setPaymentMethodsByFiat(normalized.paymentMethodsByFiat);
        if (!normalized.fiatCurrencies.includes(fiatCurrency)) {
          const nextFiat = normalized.fiatCurrencies[0] ?? "USD";
          setFiatCurrency(nextFiat);
          setPaymentMethod(normalized.paymentMethodsByFiat[nextFiat]?.[0] ?? "");
        }
      } catch {
        // Keep the default USD/NGN fallback if the metadata endpoint is unavailable.
      }
    };

    loadFiatCurrencies();
  }, []);

  useEffect(() => {
    setPage(1);
    dispatch(
      fetchOffers({
        page: 1,
        per_page: 20,
        type: tab === "buy" ? "sell" : "buy",
        crypto_currency: COINS.includes(selectedCoinFilter) ? selectedCoinFilter : undefined,
        payment_method: paymentFilter === "All" ? undefined : normalizePaymentMethodValue(paymentFilter),
        amount: amountFilter.trim() || undefined,
      })
    );
  }, [dispatch, tab, selectedCoinFilter, paymentFilter, amountFilter]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (coinDropdownRef.current && !coinDropdownRef.current.contains(event.target as Node)) {
        setShowCoinDropdown(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBuyOffer = (offer: P2POffer) => {
    // Check KYC status first
    if (kycStatus !== 'approved') {
      router.push("/dashboard/kyc");
      return;
    }
    
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedP2POffer", JSON.stringify(offer));
    }
    dispatch(clearP2POrderState());
    setSelectedOrderOffer(offer);
    setOrderAmount("");
    setOrderPaymentMethod(getOfferPaymentMethods(offer)[0] || "");
    setOrderBankName("");
    setOrderAccountName("");
    setOrderAccountNumber("");
    setOrderIbanNumber("");
    setOrderInstructions("Send exact amount. Include order number in reference.");
  };

  const closeOrderModal = () => {
    setSelectedOrderOffer(null);
    setOrderAmount("");
    setOrderPaymentMethod("");
    setOrderBankName("");
    setOrderAccountName("");
    setOrderAccountNumber("");
    setOrderIbanNumber("");
  };

  const handleInitiateOrder = async () => {
    if (!selectedOrderOffer || !selectedOrderCanSubmit) return;

    try {
      const result = await dispatch(
        initiateP2POrder({
          offer_id: selectedOrderOffer.id,
          crypto_amount: orderAmount,
          payment_method: orderPaymentMethod || selectedOrderPaymentMethods[0] || "",
          bank_name: orderBankName,
          account_name: orderAccountName,
          account_number: orderAccountNumber,
          iban_number: orderIbanNumber,
          instructions: orderInstructions,
        })
      ).unwrap();

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `p2pOrder_${selectedOrderOffer.id}`,
          JSON.stringify({
            loading: false,
            error: null,
            order: result,
            successMessage: "Order created successfully. Complete payment to finish the trade.",
          })
        );
      }

      setOrderAmount("");
      router.push(`/dashboard/p2p/order?selectedOfferId=${selectedOrderOffer.id}`);
    } catch {
      // The slice renders the API error in the modal.
    }
  };

  const matchesSearchQuery = (offer: P2POffer, query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      return true;
    }

    const sellerName = (offer.user?.full_name || offer.user?.username || "Merchant").toLowerCase();
    const coinText = getOfferCrypto(offer).toLowerCase();
    const paymentMethodText = getOfferPaymentMethods(offer).join(" ").toLowerCase();
    const priceText = String(offer.price || offer.price_per_coin || "").toLowerCase();
    const minLimitText = String(offer.min_order_limit || "").toLowerCase();
    const maxLimitText = String(offer.max_order_limit || "").toLowerCase();
    const availableText = String(offer.available_amount || "").toLowerCase();
    const networkText = String(offer.network || "").toLowerCase();
    const bankText = String(offer.bank_name || "").toLowerCase();
    const fiatCurrencyText = String(offer.fiat_currency || "").toLowerCase();
    const statusText = String(offer.status || "").toLowerCase();

    const typeText = String(offer.type || "").toLowerCase();
    const usernameText = String(offer.user?.username || "").toLowerCase();
    const numericQueryString = trimmedQuery.match(/[0-9.]+/g)?.join("") ?? "";
    const numericQuery = numericQueryString ? Number(numericQueryString) : NaN;
    const matchesNumericValue =
      numericQueryString !== "" &&
      Number.isFinite(numericQuery) &&
      (getOfferPrice(offer) === numericQuery ||
        Number(offer.min_order_limit) === numericQuery ||
        Number(offer.max_order_limit) === numericQuery ||
        Number(offer.available_amount) === numericQuery);

    return (
      sellerName.includes(trimmedQuery) ||
      usernameText.includes(trimmedQuery) ||
      coinText.includes(trimmedQuery) ||
      typeText.includes(trimmedQuery) ||
      paymentMethodText.includes(trimmedQuery) ||
      priceText.includes(trimmedQuery) ||
      minLimitText.includes(trimmedQuery) ||
      maxLimitText.includes(trimmedQuery) ||
      availableText.includes(trimmedQuery) ||
      networkText.includes(trimmedQuery) ||
      bankText.includes(trimmedQuery) ||
      fiatCurrencyText.includes(trimmedQuery) ||
      statusText.includes(trimmedQuery) ||
      matchesNumericValue
    );
  };

  const filteredOffers = offers.filter((offer: P2POffer) => {
    const normalizedPaymentFilter = normalizePaymentMethodValue(paymentFilter);
    const offerPaymentMethods = getOfferPaymentMethods(offer).map(normalizePaymentMethodValue);
    const matchPayment =
      normalizedPaymentFilter === "all" ? true : offerPaymentMethods.includes(normalizedPaymentFilter);

    const normalizedCoinFilter = selectedCoinFilter.trim().toLowerCase();
    const offerCoin = getOfferCrypto(offer).trim().toLowerCase();
    const offerFiat = String(offer.fiat_currency || "").trim().toLowerCase();
    const matchCoin =
      normalizedCoinFilter === "all" ||
      offerCoin === normalizedCoinFilter ||
      offerFiat === normalizedCoinFilter;

    const matchQuery = matchesSearchQuery(offer, searchQuery);
    return matchPayment && matchCoin && matchQuery;
  });

  const filteredMyOffers = myOffers.filter((offer: P2POffer) => {
    const normalizedPaymentFilter = normalizePaymentMethodValue(paymentFilter);
    const offerPaymentMethods = getOfferPaymentMethods(offer).map(normalizePaymentMethodValue);
    const matchPayment =
      normalizedPaymentFilter === "all" ? true : offerPaymentMethods.includes(normalizedPaymentFilter);

    const normalizedCoinFilter = selectedCoinFilter.trim().toLowerCase();
    const offerCoin = getOfferCrypto(offer).trim().toLowerCase();
    const offerFiat = String(offer.fiat_currency || "").trim().toLowerCase();
    const matchCoin =
      normalizedCoinFilter === "all" ||
      offerCoin === normalizedCoinFilter ||
      offerFiat === normalizedCoinFilter;

    return matchPayment && matchCoin && matchesSearchQuery(offer, searchQuery);
  });

  const currentRows = filteredOffers;
  const totalPages = Math.ceil(currentRows.length / PAGE_SIZE);
  const paginatedBuyOffers = filteredOffers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const paginatedSellOffers = filteredOffers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedOrderPaymentMethods = selectedOrderOffer ? getOfferPaymentMethods(selectedOrderOffer) : [];
  const selectedOrderPrice = selectedOrderOffer ? getOfferPrice(selectedOrderOffer) : 0;
  const selectedOrderCrypto = selectedOrderOffer ? getOfferCrypto(selectedOrderOffer) : "USDT";
  const selectedOrderAmountNumber = Number(orderAmount);
  const selectedOrderFiatAmount =
    selectedOrderOffer && orderAmount && Number.isFinite(selectedOrderAmountNumber)
      ? selectedOrderAmountNumber * selectedOrderPrice
      : 0;
  const selectedOrderMinLimit = selectedOrderOffer ? Number(selectedOrderOffer.min_order_limit) : 0;
  const selectedOrderMaxLimit = selectedOrderOffer ? Number(selectedOrderOffer.max_order_limit) : Infinity;
  const selectedOrderAvailable = selectedOrderOffer ? Number(selectedOrderOffer.available_amount) : 0;
  const selectedOrderAmountError =
    orderAmount.trim() && selectedOrderOffer
      ? !Number.isFinite(selectedOrderAmountNumber) || selectedOrderAmountNumber <= 0
        ? "Please enter a valid amount."
        : selectedOrderAmountNumber > selectedOrderAvailable
          ? `Only ${selectedOrderAvailable.toLocaleString()} ${selectedOrderCrypto} is available.`
          : selectedOrderFiatAmount < selectedOrderMinLimit
            ? `Minimum order amount is ${formatFiatAmount(selectedOrderMinLimit, selectedOrderOffer.fiat_currency)}.`
            : selectedOrderFiatAmount > selectedOrderMaxLimit
              ? `Maximum order amount is ${formatFiatAmount(selectedOrderMaxLimit, selectedOrderOffer.fiat_currency)}.`
              : ""
      : "";
  const selectedOrderNeedsPaymentDetails = selectedOrderOffer?.type === "buy";
  const selectedOrderCanSubmit =
    Boolean(selectedOrderOffer) &&
    Boolean(orderAmount.trim()) &&
    !selectedOrderAmountError &&
    Boolean(orderPaymentMethod || selectedOrderPaymentMethods[0]) &&
    (!selectedOrderNeedsPaymentDetails ||
      (Boolean(orderAccountName.trim()) &&
        Boolean(orderAccountNumber.trim()) &&
        ACCOUNT_NAME_PATTERN.test(orderAccountName.trim()) &&
        /^\d+$/.test(orderAccountNumber)));
  const maxOrderLimitError =
    offerAmount &&
    maxOrderLimit &&
    Number(maxOrderLimit) > Number(offerAmount)
      ? "Max order limit cannot be greater than offer amount."
      : minOrderLimit &&
          maxOrderLimit &&
          Number(maxOrderLimit) < Number(minOrderLimit)
        ? "Max order limit cannot be less than min order limit."
      : "";

  const handleSearch = () => {
    setPage(1);
  };

  const handleOpenOfferModal = () => {
    setShowOfferModal(true);
  };

  const handleCreateOffer = async () => {
    // Check KYC status first
    if (kycStatus !== 'approved') {
      router.push("/dashboard/kyc");
      return;
    }
    
    // Validation
    if (!offerAmount || offerAmount.trim() === "") {
      toast({ title: "Amount is required", description: "Please enter the amount you want to sell", type: "error" });
      return;
    }

    if (Number(offerAmount) <= 0 || isNaN(Number(offerAmount))) {
      toast({ title: "Invalid amount", description: "Please enter a valid positive number for amount", type: "error" });
      return;
    }

    if (!network || network.trim() === "") {
      toast({ title: "Network is required", description: "Please choose a crypto network", type: "error" });
      return;
    }

    if (!minOrderLimit || minOrderLimit.trim() === "") {
      toast({ title: "Min order limit is required", description: "Please enter minimum order limit", type: "error" });
      return;
    }

    if (Number(minOrderLimit) <= 0 || isNaN(Number(minOrderLimit))) {
      toast({ title: "Invalid min order limit", description: "Please enter a valid positive number", type: "error" });
      return;
    }

    if (!maxOrderLimit || maxOrderLimit.trim() === "") {
      toast({ title: "Max order limit is required", description: "Please enter maximum order limit", type: "error" });
      return;
    }

    if (Number(maxOrderLimit) <= 0 || isNaN(Number(maxOrderLimit))) {
      toast({ title: "Invalid max order limit", description: "Please enter a valid positive number", type: "error" });
      return;
    }

    if (maxOrderLimitError) {
      toast({ title: "Invalid max order limit", description: maxOrderLimitError, type: "error" });
      return;
    }

    if (!pricePerCoin || pricePerCoin.trim() === "") {
      toast({ title: "Price per coin is required", description: "Please enter price per coin", type: "error" });
      return;
    }

    if (Number(pricePerCoin) <= 0 || isNaN(Number(pricePerCoin))) {
      toast({ title: "Invalid price", description: "Please enter a valid positive number for price", type: "error" });
      return;
    }

    if (!fiatCurrencies.includes(fiatCurrency)) {
      toast({ title: "Invalid fiat currency", description: "Please choose a supported fiat currency", type: "error" });
      return;
    }

    if (!paymentMethod || !paymentMethodOptions.some((method) => method.value === paymentMethod)) {
      toast({
        title: "Invalid payment method",
        description: "Choose a valid payment method.",
        type: "error",
      });
      return;
    }

    if (!accountName.trim()) {
      toast({ title: "Account name is required", description: "Please enter account holder name", type: "error" });
      return;
    }

    if (!ACCOUNT_NAME_PATTERN.test(accountName.trim())) {
      toast({
        title: "Invalid account name",
        description: "Account name can contain letters, spaces, apostrophes, hyphens, and dots only",
        type: "error",
      });
      return;
    }

    if (accountNumber && !/^\d+$/.test(accountNumber)) {
      toast({ title: "Invalid account number", description: "Account number must contain numbers only", type: "error" });
      return;
    }

    if (ibanNumber && !/^[a-zA-Z0-9]+$/.test(ibanNumber)) {
      toast({ title: "Invalid IBAN number", description: "IBAN number must contain letters and numbers only", type: "error" });
      return;
    }

    if (!paymentWindow || Number(paymentWindow) <= 0 || isNaN(Number(paymentWindow))) {
      toast({ title: "Invalid payment window", description: "Please enter a valid payment window", type: "error" });
      return;
    }

    try {
      await dispatch(
        createOffer({
          type: "sell",
          coin,
          network,
          amount: offerAmount,
          price_per_coin: pricePerCoin,
          fiat_currency: fiatCurrency,
          payment_method: paymentMethod,
          min_order_limit: minOrderLimit,
          max_order_limit: maxOrderLimit,
          price_type: priceType,
          payment_window: Number(paymentWindow),
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber,
          iban_number: ibanNumber,
          instructions,
        })
      ).unwrap();
      
      toast({ 
        title: "Offer created successfully!", 
        description: "Your sell offer has been published and is now live", 
        type: "success" 
      });
      
      setShowOfferModal(false);
      setOfferAmount("");
      setMinOrderLimit("100");
      setMaxOrderLimit("2000");
      setPricePerCoin("1.01");
      setBankName("");
      setAccountName("");
      setAccountNumber("");
      setIbanNumber("");
      setInstructions("Send exact amount. Include order number in reference.");
      dispatch(fetchMyOffers());
    } catch (err: any) {
      toast({ 
        title: "Failed to create offer", 
        description:
          typeof err === "string"
            ? err
            : err?.message || "An error occurred while creating your offer", 
        type: "error" 
      });
    }
  };

  return (
    <>
      <Toaster toasts={toasts} onDismiss={dismiss} />
      <div className="min-h-screen bg-[#0d0d14] text-white font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">

        {!kycStatusLoading && kycStatus !== 'approved' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex gap-4 mb-6">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <p className="text-amber-500 font-medium">KYC Verification Required</p>
              <p className="text-gray-400 text-sm mt-1">You must complete KYC verification before buying or selling crypto. Please visit the <a href="/dashboard/kyc" className="text-violet-400 hover:underline">KYC page</a> to verify your identity.</p>
            </div>
          </div>
        )}

        <div className="mb-3 rounded-2xl border border-white/10 bg-[#0f111b] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex w-full shrink-0 rounded-xl border border-white/5 bg-[#171927] p-1 sm:w-auto">
              {(["buy", "sell"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setPage(1);
                  }}
                  className={`flex-1 rounded-lg px-6 py-2.5 text-sm font-bold capitalize transition sm:flex-none ${
                    tab === t
                      ? "bg-violet-600 text-white shadow-[0_10px_26px_rgba(124,58,237,0.35)]"
                      : "text-white/45 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto lg:justify-center">
              {COIN_FILTERS.map((coinOption) => (
                <button
                  key={coinOption}
                  type="button"
                  onClick={() => {
                    setSelectedCoinFilter(coinOption);
                    setPage(1);
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
                    selectedCoinFilter === coinOption
                      ? "border-violet-400/70 bg-violet-600/15 text-white shadow-[0_0_24px_rgba(124,58,237,0.18)]"
                      : "border-white/8 bg-[#141621] text-white/70 hover:border-white/15 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                    coinOption === "USDT"
                      ? "bg-emerald-500 text-white"
                      : coinOption === "BTC"
                        ? "bg-orange-500 text-white"
                        : coinOption === "ETH"
                          ? "bg-indigo-500 text-white"
                          : coinOption === "BNB"
                            ? "bg-amber-400 text-black"
                            : coinOption === "USDC"
                              ? "bg-blue-500 text-white"
                              : "bg-amber-400 text-black"
                  }`}>
                    {coinOption === "All" ? "*" : coinOption.charAt(0)}
                  </span>
                  {coinOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-[#0f111b] p-2 shadow-[0_18px_55px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <input
              type="number"
              value={amountFilter}
              onChange={(e) => {
                setAmountFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Enter Amount"
              className="h-12 w-full rounded-xl border border-white/8 bg-[#171927] px-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-violet-400/60 xl:w-48"
            />

            <div ref={filterDropdownRef} className="relative w-full xl:w-64">
              <button
                type="button"
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowCoinDropdown(false);
                }}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-white/8 bg-[#171927] px-4 text-sm text-white/75 transition hover:border-violet-400/40 hover:bg-[#1d2030]"
              >
                <span>{paymentFilter === "All" ? "All Payment Methods" : formatPaymentMethod(paymentFilter)}</span>
                <ChevronDown size={16} className="text-white/45" />
              </button>

              {showFilterDropdown && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#1e1e2e] shadow-2xl">
                  {paymentMethods.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setPaymentFilter(m);
                        setPage(1);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition hover:bg-violet-600/20 ${
                        paymentFilter === m ? "bg-violet-600/10 text-violet-300" : "text-white/80"
                      }`}
                    >
                      {m === "All" ? "All Payment Methods" : formatPaymentMethod(m)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search merchants, price, limits, payment method"
                className="h-12 min-w-0 flex-1 rounded-xl border border-white/8 bg-[#171927] px-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-violet-400/60"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold shadow-[0_12px_30px_rgba(124,58,237,0.35)] transition hover:bg-violet-500 active:scale-95"
              >
                <Search size={18} />
                Search
              </button>
              {tab === "sell" && (
                <button
                  type="button"
                  onClick={handleOpenOfferModal}
                  className="hidden h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-5 text-sm font-semibold text-violet-100 transition hover:border-violet-300/60 hover:bg-violet-500/20 xl:flex"
                >
                  <Plus size={16} />
                  Create Offer
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Buy / Sell Tabs */}
        <div className="hidden gap-6 mb-6 border-b border-white/10 overflow-x-auto pb-1">
          {(["buy", "sell"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              className={`pb-3 text-base font-semibold capitalize tracking-wide whitespace-nowrap transition-colors ${
                tab === t
                  ? "text-white border-b-2 border-violet-500"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t} Crypto
            </button>
          ))}
        </div>

        {/* Filters & Search Bar */}
        <div className="hidden flex-col lg:flex-row gap-3 mb-6 bg-[#16161f] rounded-2xl border border-white/10 p-3">
          {/* Coin Picker */}
          <div ref={coinDropdownRef} className="relative w-full lg:w-auto">
            <Button
              onClick={() => {
                setShowCoinDropdown(!showCoinDropdown);
                setShowFilterDropdown(false);
              }}
              className="w-full lg:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#1e1e2e] hover:bg-[#25253a] text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-black">₿</span>
                <span>{selectedCoinFilter}</span>
              </div>
              <ChevronDown size={16} className="text-white/50" />
            </Button>

            {showCoinDropdown && (
              <div className="absolute z-50 top-full mt-2 left-0 w-full lg:w-40 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {COIN_FILTERS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCoinFilter(c);
                      setPage(1);
                      setShowCoinDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-violet-600/20 transition ${
                      selectedCoinFilter === c ? "text-violet-400 bg-violet-600/10" : "text-white/80"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="number"
            value={amountFilter}
            onChange={(e) => {
              setAmountFilter(e.target.value);
              setPage(1);
            }}
            placeholder="Amount"
            className="w-full lg:w-40 bg-[#1e1e2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/40"
          />

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search merchants, price, limits, payment method"
            className="w-full lg:flex-1 bg-[#1e1e2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/40"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition font-semibold text-sm active:scale-95"
          >
            <Search size={18} />
            Search
          </button>

          {/* Payment Filter */}
          <div ref={filterDropdownRef} className="relative w-full lg:w-auto">
            <button
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowCoinDropdown(false);
              }}
              className="w-full lg:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#1e1e2e] hover:bg-[#25253a] text-sm"
            >
              <div className="flex items-center gap-2">
                <Search size={18} className="text-white/60" />
                <span>Filter</span>
              </div>
              <ChevronDown size={16} className="text-white/50" />
            </button>

            {showFilterDropdown && (
              <div className="absolute z-50 top-full mt-2 right-0 w-full lg:w-48 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {paymentMethods.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setPaymentFilter(m);
                      setPage(1);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-violet-600/20 transition ${
                      paymentFilter === m ? "text-violet-400 bg-violet-600/10" : "text-white/80"
                    }`}
                  >
                    {m === "All" ? "All" : formatPaymentMethod(m)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {tab === "sell" && (
          <div className="mb-5 flex xl:hidden">
            <button
              type="button"
              onClick={handleOpenOfferModal}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 text-sm font-semibold text-violet-100 transition hover:border-violet-300/60 hover:bg-violet-500/20 sm:w-auto"
            >
              <Plus size={16} />
              Create Offer
            </button>
          </div>
        )}

        {/* Table / Card Layout */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f111b] shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
          {tab === "sell" ? (
            <>
              <div className="hidden md:grid grid-cols-[1.35fr_0.85fr_1.05fr_0.8fr_1.2fr_0.8fr] px-6 py-4 bg-[#131622] border-b border-white/8 text-[11px] text-white/35 font-bold tracking-wider uppercase">
                <span>Buyer</span>
                <span>Price</span>
                <span>Available</span>
                <span>Limits</span>
                <span>Payment Methods</span>
                <span>Trade</span>
              </div>

              {offersLoading ? (
                <div className="space-y-3 px-6 py-5 animate-pulse" aria-label="Loading sell offers">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {[0, 1, 2, 3, 4, 5].map((cell) => (
                        <div key={cell} className="h-10 rounded-xl bg-white/5" />
                      ))}
                    </div>
                  ))}
                </div>
              ) : offersError ? (
                <div className="py-20 text-center text-red-400 text-sm">{offersError}</div>
              ) : paginatedSellOffers.length === 0 ? (
                <div className="py-20 text-center text-white/40 text-sm">
                  No buyers found for your criteria.
                </div>
              ) : (
                paginatedSellOffers.map((offer: P2POffer) => {
                  const buyerName = offer.user?.full_name || offer.user?.username || "Buyer";
                  const buyerRating = getMerchantUserRating(offer);
                  const availablePercent = getOfferAvailablePercent(offer);

                  return (
                    <div
                      key={offer.id}
                      className="group border-b border-white/8 last:border-none transition-all hover:bg-violet-500/[0.04]"
                    >
                      <div className="hidden md:grid grid-cols-[1.35fr_0.85fr_1.05fr_0.8fr_1.2fr_0.8fr] items-center px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#171a27] text-base font-bold text-white shadow-inner shadow-white/5">
                            {buyerName.charAt(0).toUpperCase()}
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f111b] bg-emerald-400" />
                          </div>
                          <div>
                            <p className="flex items-center gap-1.5 font-semibold text-white">
                              {buyerName}
                              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-300">OK</span>
                            </p>
                            <div className="mt-1 flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={11}
                                  className={i < Math.max(1, buyerRating) ? "fill-amber-400 text-amber-400" : "text-white/15"}
                                />
                              ))}
                              <span className="ml-1 text-[11px] text-white/45">{Number(offer.rating || buyerRating || 0).toFixed(2)}</span>
                            </div>
                            <p className="mt-1 text-[11px] text-white/45">
                              {offer.rating_count ?? offer.trader_rating_count ?? 0} Orders <span className="px-1">|</span> {buyerRating * 20}%
                            </p>
                          </div>
                        </div>

                        <div>
                          <p>
                            <span className="font-mono text-xl font-bold text-white">{Number(getOfferPrice(offer)).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                            <span className="ml-1.5 text-xs text-white/70">{offer.fiat_currency}</span>
                          </p>
                          <p className="mt-1 text-[11px] text-white/35">~ {formatFiatAmount(getOfferPrice(offer), offer.fiat_currency)}</p>
                          <span className="mt-1 inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">+0.20%</span>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white/85">{Number(offer.available_amount).toLocaleString()} {getOfferCrypto(offer)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-emerald-400"
                                style={{ width: `${availablePercent}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-300">{availablePercent}%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-l border-white/10 pl-3 text-xs">
                          <div>
                            <p className="text-white/35">Min</p>
                            <p className="mt-1 font-semibold text-white">{formatFiatAmount(offer.min_order_limit, offer.fiat_currency)}</p>
                          </div>
                          <div>
                            <p className="text-white/35">Max</p>
                            <p className="mt-1 font-semibold text-white">{formatFiatAmount(offer.max_order_limit, offer.fiat_currency)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {getOfferPaymentMethods(offer).slice(0, 3).map((method, index) => (
                            <span key={method} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1b2032] px-2.5 py-1.5 text-xs text-white/80">
                              <span className={`h-2 w-2 rounded-full ${index % 2 === 0 ? "bg-blue-400" : "bg-emerald-400"}`} />
                              {formatPaymentMethod(method)}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <div className="text-right">
                            <Button
                              onClick={() => handleBuyOffer(offer)}
                              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold shadow-[0_12px_28px_rgba(124,58,237,0.28)] hover:bg-violet-500 active:scale-95"
                            >
                              Sell {getOfferCrypto(offer)}
                            </Button>
                            <p className="mt-2 flex items-center justify-end gap-1 text-[11px] text-white/35">
                              <Clock size={11} /> 15 min
                            </p>
                          </div>
                          {/* <ChevronRight size={18} className="text-white/35 transition group-hover:translate-x-1 group-hover:text-white/70" /> */}
                        </div>
                      </div>

                      <div className="md:hidden p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10" />
                            <div>
                              <p className="font-semibold">{buyerName}</p>
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={13}
                                    className={i < buyerRating ? "fill-amber-400 text-amber-400" : "text-white/20"}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-lg font-semibold text-emerald-400">
                              {formatFiatAmount(getOfferPrice(offer), offer.fiat_currency)}
                            </p>
                            <p className="text-xs text-white/50">per {getOfferCrypto(offer)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-white/40 text-xs">Available</p>
                            <p className="font-medium">{Number(offer.available_amount).toLocaleString()} {getOfferCrypto(offer)}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs">Limits</p>
                            <p className="font-medium">{formatFiatAmount(offer.min_order_limit, offer.fiat_currency)} - {formatFiatAmount(offer.max_order_limit, offer.fiat_currency)}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-white/40 text-xs mb-1">Payment Method</p>
                          <p className="text-white/80">{getOfferPaymentMethods(offer).map(formatPaymentMethod).join(", ")}</p>
                        </div>

                        <Button
                          onClick={() => handleBuyOffer(offer)}
                          className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-base font-semibold active:scale-[0.985]"
                        >
                          Sell Now
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[1.35fr_0.85fr_1.05fr_0.8fr_1.2fr_0.8fr] px-6 py-4 bg-[#131622] border-b border-white/8 text-[11px] text-white/35 font-bold tracking-wider uppercase">
                <span>Merchant</span>
                <span>Price</span>
                <span>Available</span>
                <span>Limits</span>
                <span>Payment Methods</span>
                <span>Trade</span>
              </div>

              {offersLoading ? (
                <div className="space-y-3 px-6 py-5 animate-pulse" aria-label="Loading buy offers">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {[0, 1, 2, 3, 4, 5].map((cell) => (
                        <div key={cell} className="h-10 rounded-xl bg-white/5" />
                      ))}
                    </div>
                  ))}
                </div>
              ) : offersError ? (
                <div className="py-20 text-center text-red-400 text-sm">{offersError}</div>
              ) : paginatedBuyOffers.length === 0 ? (
                <div className="py-20 text-center text-white/40 text-sm">
                  No merchants found for your criteria.
                </div>
              ) : (
                paginatedBuyOffers.map((offer: P2POffer) => {
                  const sellerName = offer.user?.full_name || offer.user?.username || "Merchant";
                  const sellerRating = getMerchantUserRating(offer);
                  const availablePercent = getOfferAvailablePercent(offer);

                  return (
                    <div
                      key={offer.id}
                      className="group border-b border-white/8 last:border-none transition-all hover:bg-violet-500/[0.04]"
                    >
                      {/* Desktop Row */}
                      <div className="hidden md:grid grid-cols-[1.35fr_0.85fr_1.05fr_0.8fr_1.2fr_0.8fr] items-center px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#171a27] text-base font-bold text-white shadow-inner shadow-white/5">
                            {sellerName.charAt(0).toUpperCase()}
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f111b] bg-emerald-400" />
                          </div>
                          <div>
                            <p className="flex items-center gap-1.5 font-semibold text-white">
                              {sellerName}
                              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-300">OK</span>
                            </p>
                            <div className="mt-1 flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={11}
                                  className={i < Math.max(1, sellerRating) ? "fill-amber-400 text-amber-400" : "text-white/15"}
                                />
                              ))}
                              <span className="ml-1 text-[11px] text-white/45">{Number(offer.rating || sellerRating || 0).toFixed(2)}</span>
                            </div>
                            <p className="mt-1 text-[11px] text-white/45">
                              {offer.rating_count ?? offer.trader_rating_count ?? 0} Orders <span className="px-1">|</span> {sellerRating * 20}%
                            </p>
                          </div>
                        </div>

                        <div>
                          <p>
                            <span className="font-mono text-xl font-bold text-white">{Number(getOfferPrice(offer)).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                            <span className="ml-1.5 text-xs text-white/70">{offer.fiat_currency}</span>
                          </p>
                          <p className="mt-1 text-[11px] text-white/35">~ {formatFiatAmount(getOfferPrice(offer), offer.fiat_currency)}</p>
                          <span className="mt-1 inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">+0.20%</span>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white/85">{Number(offer.available_amount).toLocaleString()} {getOfferCrypto(offer)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-emerald-400"
                                style={{ width: `${availablePercent}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-300">{availablePercent}%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-l border-white/10 pl-3 text-xs">
                          <div>
                            <p className="text-white/35">Min</p>
                            <p className="mt-1 font-semibold text-white">{formatFiatAmount(offer.min_order_limit, offer.fiat_currency)}</p>
                          </div>
                          <div>
                            <p className="text-white/35">Max</p>
                            <p className="mt-1 font-semibold text-white">{formatFiatAmount(offer.max_order_limit, offer.fiat_currency)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {getOfferPaymentMethods(offer).slice(0, 3).map((method, index) => (
                            <span key={method} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1b2032] px-2.5 py-1.5 text-xs text-white/80">
                              <span className={`h-2 w-2 rounded-full ${index % 2 === 0 ? "bg-blue-400" : "bg-emerald-400"}`} />
                              {formatPaymentMethod(method)}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <div className="text-right">
                            <Button
                              onClick={() => handleBuyOffer(offer)}
                              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold shadow-[0_12px_28px_rgba(124,58,237,0.28)] hover:bg-violet-500 active:scale-95"
                            >
                              Buy {getOfferCrypto(offer)}
                            </Button>
                            <p className="mt-2 flex items-center justify-end gap-1 text-[11px] text-white/35">
                              <Clock size={11} /> 15 min
                            </p>
                          </div>
                          {/* <ChevronRight size={18} className="text-white/35 transition group-hover:translate-x-1 group-hover:text-white/70" /> */}
                        </div>
                      </div>

                      {/* Mobile Card */}
                      <div className="md:hidden p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10" />
                            <div>
                              <p className="font-semibold">{sellerName}</p>
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={13}
                                    className={i < sellerRating ? "fill-amber-400 text-amber-400" : "text-white/20"}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-mono text-lg font-semibold text-emerald-400">
                              {formatFiatAmount(getOfferPrice(offer), offer.fiat_currency)}
                            </p>
                            <p className="text-xs text-white/50">per {getOfferCrypto(offer)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-white/40 text-xs">Available</p>
                            <p className="font-medium">{Number(offer.available_amount).toLocaleString()} {getOfferCrypto(offer)}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs">Limits</p>
                            <p className="font-medium">
                              {formatFiatAmount(offer.min_order_limit, offer.fiat_currency)} - {formatFiatAmount(offer.max_order_limit, offer.fiat_currency)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-white/40 text-xs mb-1">Payment Method</p>
                          <p className="text-white/80">{getOfferPaymentMethods(offer).map(formatPaymentMethod).join(", ")}</p>
                        </div>

                        <Button
                          onClick={() => handleBuyOffer(offer)}
                          className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-base font-semibold active:scale-[0.985]"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
            <span className="text-sm text-white/40 text-center sm:text-left">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, currentRows.length)}-
              {Math.min(page * PAGE_SIZE, currentRows.length)} of {currentRows.length} {tab === "sell" ? "buyers" : "merchants"}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1e1e2e] border border-white/10 disabled:opacity-30 hover:bg-violet-600/20 transition"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1e1e2e] border border-white/10 disabled:opacity-30 hover:bg-violet-600/20 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedOrderOffer && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-3 sm:items-center sm:p-5">
          <div className="relative my-3 grid max-h-[calc(100vh-1.5rem)] w-full max-w-[940px] min-w-0 gap-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#11131d] p-3 shadow-2xl sm:my-4 sm:max-h-[calc(100vh-2rem)] sm:p-4 xl:grid-cols-[1fr_0.84fr] xl:gap-6">
            <button
              type="button"
              onClick={closeOrderModal}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-[#171926]/90 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close P2P order modal"
            >
              <X size={20} />
            </button>

            <div className="min-w-0 space-y-4">
              <div className="flex items-start gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0b0c12] text-base font-bold text-white sm:h-12 sm:w-12 sm:text-lg">
                  {(selectedOrderOffer.user?.full_name || selectedOrderOffer.user?.username || "T").charAt(0).toUpperCase()}
                  <span className="absolute bottom-1 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#11131d] bg-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 pr-10">
                    <h3 className="break-words text-lg font-bold text-white">
                      {selectedOrderOffer.user?.full_name || selectedOrderOffer.user?.username || "Merchant"}
                    </h3>
                    <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-300">
                      P2P
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-2.5 text-[11px] text-white/55">
                    <span className="text-emerald-400">Email</span>
                    <span>SMS</span>
                    <span className="text-emerald-400">Identity Verification</span>
                    <span>Deposit</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div className="space-y-2.5">
                  <div className="flex justify-between gap-4">
                    <span className="text-white/50">Good Rating %</span>
                    <span className="font-semibold text-white">{Number(selectedOrderOffer.rating || 0).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white/50">Completed Order(s)</span>
                    <span className="font-semibold text-white">
                      {selectedOrderOffer.rating_count ?? selectedOrderOffer.trader_rating_count ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white/50">Avg. Release Time</span>
                    <span className="font-semibold text-white">15m</span>
                  </div>
                </div>

                <div className="space-y-2.5 border-white/10 md:border-l md:pl-6">
                  <div className="flex justify-between gap-4">
                    <span className="text-white/50">Completion Rate Within 30 Days</span>
                    <span className="font-semibold text-white">98%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white/50">Available</span>
                    <span className="font-semibold text-white">
                      {Number(selectedOrderOffer.available_amount).toLocaleString()} {selectedOrderCrypto}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white/50">Limits</span>
                    <span className="font-semibold text-white">
                      {formatFiatAmount(selectedOrderOffer.min_order_limit, selectedOrderOffer.fiat_currency)} - {formatFiatAmount(selectedOrderOffer.max_order_limit, selectedOrderOffer.fiat_currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <p className="mb-2 text-sm font-semibold text-white">Advertiser Terms</p>
                <div className="rounded-2xl border border-white/10 bg-[#171926] px-4 py-3 text-sm leading-relaxed text-white/65">
                  {selectedOrderOffer.instructions || "Merchants may include additional terms in their advertiser instructions."}
                </div>
              </div>

              {selectedOrderNeedsPaymentDetails ? (
                <div className="rounded-2xl border border-white/10 bg-[#171926] p-3.5">
                  <p className="mb-2.5 text-sm font-semibold text-white">Your Payment Details</p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <label className="text-sm text-white/70">
                      Bank Name
                      <input
                        type="text"
                        value={orderBankName}
                        onChange={(event) => setOrderBankName(event.target.value)}
                        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#11131d] px-3 text-sm text-white outline-none"
                      />
                    </label>
                    <label className="text-sm text-white/70">
                      Account Name
                      <input
                        type="text"
                        value={orderAccountName}
                        onChange={(event) => setOrderAccountName(cleanAccountName(event.target.value))}
                        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#11131d] px-3 text-sm text-white outline-none"
                      />
                    </label>
                    <label className="text-sm text-white/70">
                      Account Number
                      <input
                        type="number"
                        value={orderAccountNumber}
                        onChange={(event) => setOrderAccountNumber(event.target.value)}
                        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#11131d] px-3 text-sm text-white outline-none"
                      />
                    </label>
                    <label className="text-sm text-white/70">
                      IBAN Number
                      <input
                        type="text"
                        value={orderIbanNumber}
                        onChange={(event) => setOrderIbanNumber(event.target.value)}
                        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#11131d] px-3 text-sm text-white outline-none"
                      />
                    </label>
                    <label className="text-sm text-white/70 sm:col-span-2">
                      Instructions
                      <textarea
                        value={orderInstructions}
                        onChange={(event) => setOrderInstructions(event.target.value)}
                        className="mt-1.5 min-h-[58px] w-full resize-none rounded-xl border border-white/10 bg-[#11131d] px-3 py-2.5 text-sm text-white outline-none"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#171926] p-3.5">
                  <p className="mb-2.5 text-sm font-semibold text-white">Payment Details</p>
                  <div className="grid gap-2.5 text-sm sm:grid-cols-2">
                    {[
                      { label: "Bank", value: selectedOrderOffer.bank_name },
                      { label: "Account Name", value: selectedOrderOffer.account_name },
                      { label: "Account Number", value: selectedOrderOffer.account_number },
                      { label: "IBAN Number", value: selectedOrderOffer.iban_number },
                    ].filter((item) => item.value).map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-white/40">{item.label}</p>
                        <p className="mt-1 font-medium text-white/85">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-3.5">
              <div className="flex flex-wrap items-center gap-3 pr-10 xl:pr-0">
                <span className="text-base text-white/75">Price</span>
                <span className="text-xl font-bold text-emerald-400">
                  {Number(selectedOrderPrice).toLocaleString("en-US", { maximumFractionDigits: 8 })} {selectedOrderOffer.fiat_currency}
                </span>
              </div>

              <label className="block rounded-2xl border border-white/10 bg-[#171926] px-4 py-3 transition focus-within:border-violet-500/50">
                <span className="text-sm text-white/70">
                  {selectedOrderOffer.type === "buy" ? "I will receive" : "I will pay"}
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    value={orderAmount}
                    onChange={(event) => setOrderAmount(event.target.value)}
                    placeholder="0.00"
                    className="min-w-0 flex-1 bg-transparent text-xl font-semibold text-white outline-none placeholder:text-white/25 sm:text-2xl"
                  />
                  <span className="font-bold text-white">{selectedOrderCrypto}</span>
                </div>
              </label>

              <div className="rounded-2xl border border-white/10 bg-[#171926] px-4 py-3">
                <p className="text-sm text-white/70">
                  {selectedOrderOffer.type === "buy" ? "I will pay" : "I will receive"}
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="min-w-0 break-all text-xl font-semibold text-white/45 sm:text-2xl">
                    {selectedOrderFiatAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="font-bold text-white">{selectedOrderOffer.fiat_currency}</span>
                </div>
              </div>

              <label className="block rounded-2xl border border-white/10 bg-[#171926] px-4 py-3">
                <span className="text-sm text-white/70">Payment Method</span>
                <select
                  value={orderPaymentMethod}
                  onChange={(event) => setOrderPaymentMethod(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#11131d] px-3 text-sm font-semibold text-white outline-none"
                >
                  {selectedOrderPaymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {formatPaymentMethod(method)}
                    </option>
                  ))}
                </select>
              </label>

              {selectedOrderAmountError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {selectedOrderAmountError}
                </div>
              )}

              {orderError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {orderError}
                </div>
              )}

              {orderSuccessMessage && orderResult?.order?.offer_id === selectedOrderOffer.id && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {orderSuccessMessage}
                  {orderResult.order.order_number && (
                    <span className="mt-1 block text-white/75">Order number: {orderResult.order.order_number}</span>
                  )}
                </div>
              )}

              <Button
                type="button"
                onClick={handleInitiateOrder}
                disabled={!selectedOrderCanSubmit || orderLoading}
                className="w-full rounded-2xl bg-violet-600 py-3.5 text-base font-bold shadow-lg shadow-violet-950/30 hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {orderLoading
                  ? "Creating order..."
                  : selectedOrderOffer.type === "buy"
                    ? `Sell ${selectedOrderCrypto}`
                    : `Buy ${selectedOrderCrypto}`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-white/65">
                <span className="h-4 w-4 rounded-full bg-emerald-500" />
                <span>Withdraw Protection</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-xl sm:max-w-2xl bg-[#0f1220] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h2 className="text-xl font-semibold">Create Sell Offer</h2>
                <p className="text-sm text-white/50 mt-1">Fill in the offer details and submit to publish your sell offer.</p>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="p-6 space-y-4 max-h-[62vh] overflow-y-auto"
              autoComplete="on"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateOffer();
              }}
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Coin
                  <select
                    name="coin"
                    value={coin}
                    onChange={(e) => setCoin(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {COINS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Network
                  <select
                    name="network"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {NETWORKS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Amount
                  <input
                    name="amount"
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="2500"
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Price per coin
                  <input
                    name="pricePerCoin"
                    type="number"
                    step="0.01"
                    value={pricePerCoin}
                    onChange={(e) => setPricePerCoin(e.target.value)}
                    placeholder="1.01"
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Min order limit
                  <input
                    name="minOrderLimit"
                    type="number"
                    value={minOrderLimit}
                    onChange={(e) => setMinOrderLimit(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Max order limit
                  <input
                    name="maxOrderLimit"
                    type="number"
                    max={offerAmount || undefined}
                    value={maxOrderLimit}
                    onChange={(e) => setMaxOrderLimit(e.target.value)}
                    aria-invalid={Boolean(maxOrderLimitError)}
                    autoComplete="off"
                    className={`w-full rounded-2xl bg-[#161724] border px-4 py-3 text-sm text-white outline-none ${
                      maxOrderLimitError ? "border-red-500/60" : "border-white/10"
                    }`}
                  />
                  {maxOrderLimitError && (
                    <p className="text-xs font-medium text-red-400">{maxOrderLimitError}</p>
                  )}
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Price type
                  <select
                    name="priceType"
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {PRICE_TYPES.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Fiat currency
                  <select
                    name="fiatCurrency"
                    value={fiatCurrency}
                    onChange={(e) => {
                      const nextFiat = e.target.value;
                      setFiatCurrency(nextFiat);
                    }}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {fiatCurrencies.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Payment method
                  <select
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => {
                      const selectedMethod = paymentMethodOptions.find((method) => method.value === e.target.value);
                      setPaymentMethod(e.target.value);
                      setBankName(selectedMethod?.label ?? bankName);
                    }}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {paymentMethodsLoading && <option value={paymentMethod}>Loading...</option>}
                    {paymentMethodOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Payment window
                  <input
                    name="paymentWindow"
                    type="number"
                    value={paymentWindow}
                    onChange={(e) => setPaymentWindow(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Bank name
                  <input
                    name="bankName"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    autoComplete="organization"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/80">
                  Account name
                  <input
                    name="accountName"
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(cleanAccountName(e.target.value))}
                    autoComplete="name"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Account number
                  <input
                    name="accountNumber"
                    type="number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    autoComplete="account-number"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/80">
                  IBAN number
                  <input
                    name="ibanNumber"
                    type="text"
                    value={ibanNumber}
                    onChange={(e) => setIbanNumber(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Instructions
                  <textarea
                    name="instructions"
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none resize-none"
                  />
                </label>
              </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-[#121428]">
              <div className="text-sm text-white/60">Create your sell offer with payment details and limits.</div>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500"
                disabled={creating}
              >
                {creating ? "Creating offer..." : "Submit Offer"}
              </Button>
            </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
