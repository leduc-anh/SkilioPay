import React, { useState, FC, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  Shield,
  Check,
  AlertCircle,
  Calendar,
  Lock,
  User as UserIcon,
  RefreshCw as RefreshCwIcon,
} from "lucide-react";
import { paylaterService } from "../services/paylaterService";
import type {
  User,
  Cart,
  Agreement,
  InstallmentStatus,
} from "../data/mockData";
import { users, carts } from "../data/mockData";

const colors = {
  primary: "#38C87B",
  secondary: "#62BE76",
  tertiary: "#1C9085",
  dark: "#13444E",
  accent: "#B7E82A",
};

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: FC<PhoneFrameProps> = ({ children }) => (
  <div className="relative mx-auto">
    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-30"></div>
    <div className="relative bg-gray-900 rounded-3xl shadow-2xl w-96 h-[720px] overflow-hidden border-8 border-gray-800 flex flex-col">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
      <div className="bg-gray-900 px-6 py-3 flex justify-between text-white text-xs z-10 flex-shrink-0">
        <span className="font-semibold">9:41</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-white rounded-sm opacity-75"></div>
            <div className="w-1 h-3 bg-white rounded-sm opacity-50"></div>
            <div className="w-1 h-3 bg-white rounded-sm opacity-25"></div>
          </div>
          <span className="font-semibold">100%</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white">{children}</div>
    </div>
  </div>
);

type Screen = "checkout" | "plan-details" | "success" | "dashboard";

interface CheckoutScreenProps {
  cart: Cart;
  eligibility: { eligible: boolean; reason: string };
  onSelectPayLater: () => void;
  onOpenDashboard: () => void;
}

const CheckoutScreen: FC<CheckoutScreenProps> = ({
  cart,
  eligibility,
  onSelectPayLater,
  onOpenDashboard,
}) => (
  <>
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="w-6" />
        <span className="font-bold text-xl">Checkout</span>
        <button onClick={onOpenDashboard} className="p-1">
          <UserIcon size={20} />
        </button>
      </div>
    </div>
    <div className="p-6 space-y-5 text-gray-900">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 shadow-sm border border-emerald-200">
        <div
          className="font-bold text-xl truncate"
          style={{ color: colors.dark }}
          title={cart.itemName}
        >
          {cart.itemName}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-emerald-200 mt-4">
          <span className="text-gray-600 font-medium">Total Amount</span>
          <div className="text-4xl font-bold" style={{ color: colors.dark }}>
            ${cart.total.toFixed(2)}
          </div>
        </div>
      </div>
      <div
        className="font-bold text-lg flex items-center gap-2 pt-2"
        style={{ color: colors.dark }}
      >
        <Calendar size={20} /> PayLater Options
      </div>
      <div className="relative group">
        <button
          onClick={onSelectPayLater}
          disabled={!eligibility.eligible}
          className={`w-full relative border-2 rounded-2xl p-4 cursor-pointer transition-all ${
            eligibility.eligible
              ? "border-emerald-500 bg-emerald-50 shadow-lg"
              : "border-gray-300 bg-gray-100 text-gray-500"
          }`}
        >
          <div
            className="absolute -top-3 right-3 px-3 py-1 rounded-full text-black text-xs font-bold shadow-lg"
            style={{ backgroundColor: colors.accent }}
          >
            POPULAR
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                eligibility.eligible ? "border-emerald-500" : "border-gray-400"
              }`}
            >
              {eligibility.eligible && (
                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full"></div>
              )}
            </div>
            <div className="flex-1 text-left">
              <div
                className={`font-bold text-lg ${
                  eligibility.eligible ? "" : "text-gray-500"
                }`}
                style={{ color: eligibility.eligible ? colors.dark : "" }}
              >
                Pay in 3 months
              </div>
              <div className="text-sm text-gray-600">
                ${(cart.total / 3).toFixed(2)} / mo • 0% Interest
              </div>
            </div>
          </div>
        </button>
        {!eligibility.eligible && (
          <div className="absolute bottom-full mb-2 w-full left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {eligibility.reason}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
        <Lock size={14} />
        <span>Secured by SkilioPay</span>
      </div>
    </div>
  </>
);

interface PlanDetailsScreenProps {
  cart: Cart;
  onConfirm: () => void;
  onBack: () => void;
}

const PlanDetailsScreen: FC<PlanDetailsScreenProps> = ({
  cart,
  onConfirm,
  onBack,
}) => {
  const installments = useMemo(() => {
    const amount = cart.total / 3;
    return [
      { due: "Today", amount: amount, date: new Date() },
      {
        due: "in 30 days",
        amount: amount,
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        due: "in 60 days",
        amount: amount,
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ];
  }, [cart.total]);

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-1">
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-xl">Payment Plan</span>
          <div className="w-6" />
        </div>
      </div>
      <div className="p-6 space-y-6 text-gray-900">
        <div className="text-center py-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
          <div className="text-sm text-gray-600 mb-2">
            Total Purchase Amount
          </div>
          <div
            className="text-6xl font-bold mb-3"
            style={{ color: colors.dark }}
          >
            ${cart.total.toFixed(2)}
          </div>
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <Calendar size={16} /> Split into 3 equal payments
          </div>
        </div>
        <div className="space-y-3">
          {installments.map((inst, i) => (
            <div
              key={i}
              className={`border-2 rounded-2xl p-4 ${
                i === 0
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      i === 0
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div
                      className="font-bold text-lg"
                      style={{ color: colors.dark }}
                    >
                      Payment {i + 1}
                    </div>
                    <div className="text-sm text-gray-600">
                      {inst.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.dark }}
                >
                  ${inst.amount.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          Confirm PayLater Plan
        </button>
      </div>
    </>
  );
};

interface SuccessScreenProps {
  agreement: Agreement | null;
  onGoToDashboard: () => void;
  onBackToHome: () => void;
}

const SuccessScreen: FC<SuccessScreenProps> = ({
  agreement,
  onGoToDashboard,
  onBackToHome,
}) => (
  <>
    <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-10 text-white text-center relative overflow-hidden flex-shrink-0">
      <div className="relative z-10">
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl animate-bounce">
          <Check size={60} style={{ color: colors.primary }} strokeWidth={3} />
        </div>
        <div className="text-3xl font-bold mb-2">Payment Successful!</div>
        <div className="text-sm opacity-90">
          Your PayLater plan is now active
        </div>
      </div>
    </div>
    <div className="p-6 space-y-5 text-gray-900">
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <span className="text-gray-600 text-sm">Plan ID</span>
          <span
            className="font-mono font-bold text-sm"
            style={{ color: colors.dark }}
          >
            {agreement?.id}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">First Payment</span>
          <span className="font-bold text-3xl" style={{ color: colors.dark }}>
            ${agreement?.schedule[0]?.amount.toFixed(2)}
          </span>
        </div>
      </div>
      <button
        onClick={onGoToDashboard}
        className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg"
        style={{ backgroundColor: colors.primary }}
      >
        View My PayLater Plans
      </button>
      <button
        onClick={onBackToHome}
        className="w-full py-3 rounded-2xl font-medium text-gray-700 hover:bg-gray-100"
      >
        Back to Home
      </button>
    </div>
  </>
);

const StatusBadge: FC<{ status: InstallmentStatus }> = ({ status }) => {
  const styles = {
    PAID: "bg-green-100 text-green-700",
    DUE: "bg-yellow-100 text-yellow-700 animate-pulse",
    UPCOMING: "bg-blue-100 text-blue-700",
    FAILED: "bg-red-100 text-red-700",
  };
  return (
    <div
      className={`text-xs font-medium px-3 py-1 rounded-full text-center ${styles[status]}`}
    >
      {status}
    </div>
  );
};

interface DashboardScreenProps {
  user: User;
  agreements: Agreement[];
  logs: Array<{ timestamp: Date; message: string }>;
  onBackToCheckout: () => void;
  onRetry: (agreementId: string, installmentIndex: number) => void;
}

const DashboardScreen: FC<DashboardScreenProps> = ({
  user,
  agreements,
  logs,
  onBackToCheckout,
  onRetry,
}) => (
  <>
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex-shrink-0">
      <div className="flex items-center justify-between">
        <button onClick={onBackToCheckout} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-xl">My PayLater</span>
        <div className="w-6" />
      </div>
    </div>
    <div className="p-6 space-y-5 bg-slate-50 text-gray-900">
      <h2 className="font-bold text-lg" style={{ color: colors.dark }}>
        Active Plans ({agreements.length})
      </h2>
      {agreements.length > 0 ? (
        agreements.map((agr) => (
          <div
            key={agr.id}
            className="bg-white border rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="font-semibold" style={{ color: colors.dark }}>
              Plan #{agr.id.slice(0, 8)}... (${agr.totalAmount.toFixed(2)})
            </div>
            {agr.schedule.map((inst, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm border-t pt-2"
              >
                <div>
                  <p className="font-medium">Installment {i + 1}</p>
                  <p className="text-xs text-gray-500">
                    {inst.dueDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="font-bold">${inst.amount.toFixed(2)}</div>
                <div className="w-20">
                  {inst.status === "FAILED" ? (
                    <button
                      onClick={() => onRetry(agr.id, i)}
                      className="text-xs bg-orange-500 text-white font-bold py-1 px-2 rounded-md flex items-center gap-1"
                    >
                      <RefreshCwIcon size={12} /> Retry
                    </button>
                  ) : (
                    <StatusBadge status={inst.status} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">No active plans.</p>
      )}

      <div>
        <h2 className="font-bold text-lg mb-2" style={{ color: colors.dark }}>
          Activity Log (Dev View)
        </h2>
        <div className="bg-gray-800 text-white font-mono text-xs rounded-lg p-3 h-32 overflow-y-auto space-y-1">
          {logs.map((log, i) => (
            <p key={i}>
              <span className="text-emerald-400">
                {log.timestamp.toLocaleTimeString()}:
              </span>{" "}
              {log.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  </>
);

// Main Prototype Component
const SkillioPayPresentation = () => {
  const [screen, setScreen] = useState<Screen>("checkout");
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [currentCart, setCurrentCart] = useState<Cart>(
    carts.find((c) => c.userId === users[0].id) || carts[0]
  );
  const [activeAgreement, setActiveAgreement] = useState<Agreement | null>(
    null
  );
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [logs, setLogs] = useState<Array<{ timestamp: Date; message: string }>>(
    []
  );
  const [eligibility, setEligibility] = useState({
    eligible: false,
    reason: "Checking...",
  });

  const refreshData = () => {
    setAgreements(paylaterService.getAgreementsForUser(currentUser.id));
    setLogs(paylaterService.getActivityLog());
    setEligibility(paylaterService.isEligible(currentUser.id, currentCart.id));
  };

  useEffect(() => {
    refreshData();
  }, [currentUser, currentCart]);

  const handleSelectPayLater = () => {
    if (eligibility.eligible) {
      setScreen("plan-details");
    }
  };

  const handleConfirmPlan = () => {
    const newAgreement = paylaterService.createPayLaterAgreement(
      currentUser.id,
      currentCart.id
    );
    if (newAgreement) {
      setActiveAgreement(newAgreement);
      setScreen("success");
      refreshData();
    } else {
      alert("Could not create PayLater agreement. Check eligibility.");
    }
  };

  const handleGoToDashboard = () => {
    setScreen("dashboard");
    refreshData();
  };

  const handleBackToCheckout = () => {
    setActiveAgreement(null);
    setScreen("checkout");
  };

  const handleRetryPayment = (
    agreementId: string,
    installmentIndex: number
  ) => {
    paylaterService.retryPayment(agreementId, installmentIndex);
    refreshData();
  };

  const handleUserChange = (userId: string) => {
    const newUser = users.find((u) => u.id === userId)!;
    setCurrentUser(newUser);
    // Auto-select the first available cart for the new user
    const newCart = carts.find((c) => c.userId === newUser.id) || currentCart;
    setCurrentCart(newCart);
  };

  const renderScreen = () => {
    switch (screen) {
      case "checkout":
        return (
          <CheckoutScreen
            cart={currentCart}
            eligibility={eligibility}
            onSelectPayLater={handleSelectPayLater}
            onOpenDashboard={handleGoToDashboard}
          />
        );
      case "plan-details":
        return (
          <PlanDetailsScreen
            cart={currentCart}
            onConfirm={handleConfirmPlan}
            onBack={() => setScreen("checkout")}
          />
        );
      case "success":
        return (
          <SuccessScreen
            agreement={activeAgreement}
            onGoToDashboard={handleGoToDashboard}
            onBackToHome={handleBackToCheckout}
          />
        );
      case "dashboard":
        return (
          <DashboardScreen
            user={currentUser}
            agreements={agreements}
            logs={logs}
            onBackToCheckout={handleBackToCheckout}
            onRetry={handleRetryPayment}
          />
        );
      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 gap-4 bg-slate-900">
      <div className="w-full max-w-md p-4 bg-slate-800 rounded-xl shadow-lg text-white">
        <h1 className="text-xl font-bold text-emerald-400 mb-4 text-center flex items-center justify-center gap-2">
          <Shield size={24} /> SkilioPay Demo Controls
        </h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="font-bold mb-1 block">Test User</label>
            <select
              onChange={(e) => handleUserChange(e.target.value)}
              value={currentUser.id}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-bold mb-1 block">Test Cart</label>
            <select
              onChange={(e) =>
                setCurrentCart(carts.find((c) => c.id === e.target.value)!)
              }
              value={currentCart.id}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
            >
              {carts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.itemName} (${c.total.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                onChange={(e) =>
                  paylaterService.setSimulateFailure(e.target.checked)
                }
                className="toggle toggle-error"
              />
              <AlertCircle size={16} className="text-red-400" />
              <span className="font-bold text-red-400">
                Simulate Payment Failure on Retry
              </span>
            </label>
          </div>
        </div>
      </div>
      <PhoneFrame>{renderScreen()}</PhoneFrame>
    </div>
  );
};

export default SkillioPayPresentation;
