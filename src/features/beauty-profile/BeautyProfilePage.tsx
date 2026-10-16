"use client";

import ProfileForm from "./ProfileForm";

/** Browser-saved skin and texture preferences. */
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
      </div>
    </main>
  );
}
