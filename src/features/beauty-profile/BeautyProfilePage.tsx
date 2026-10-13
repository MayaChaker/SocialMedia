"use client";

import ProfileForm from "./ProfileForm";
import SavedRoutineCard from "./SavedRoutineCard";
import SavedShadeCard from "./SavedShadeCard";

/** Browser-saved preferences, plus the shade and routine saved from the guided tools. */
export default function BeautyProfilePage() {
  return (
    <main className="profilePage">
      <header className="profileHeader">
        <span className="kicker">Your Veloura</span>
        <h1>Beauty profile</h1>
        <p>
          Personalise recommendations on this device. Your profile is stored only in this browser,
          not in an online account.
        </p>
      </header>
      <div className="profileLayout">
        <ProfileForm />
        <aside className="profileSaved">
          <SavedShadeCard />
          <SavedRoutineCard />
        </aside>
      </div>
    </main>
  );
}
