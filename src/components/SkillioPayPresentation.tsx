import { useState, useEffect } from "react";
import { Shield, AlertCircle } from "lucide-react";
import { paylaterService } from "../services/paylaterService";
import type { User, Cart, Agreement } from "../data/mockData";
import { users, carts } from "../data/mockData";

// Import components
import { PhoneFrame } from "./common/PhoneFrame";
import { Screen } from "./common/constants";
import { CheckoutScreen } from "./screens/CheckoutScreen";
import { PlanDetailsScreen } from "./screens/PlanDetailsScreen";
import { SuccessScreen } from "./screens/SuccessScreen";
import { DashboardScreen } from "./screens/DashboardScreen";

/**
 * SkillioPayPresentation - Main Container Component
 * Manages application state and screen navigation for PayLater MVP
 */
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
