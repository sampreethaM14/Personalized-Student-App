import React, { useState } from "react";
import Layout from "../components/Layout";
import { 
  User, 
  Mail, 
  Target, 
  Edit2, 
  Check, 
  X,
  Camera,
  LockKeyhole,
  Briefcase,
  Sparkles,
  ShieldCheck
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock state based STRICTLY on your Mongoose User Schema.
  const [profile, setProfile] = useState({
    name: "Abdul Wahab S",
    email: "abdul@gmail.com", 
    role: "student",
    academicGoal: "", 
    careerInterest: "",
    interests: "", 
  });

  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfile({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  return (
    <Layout 
      title="Profile Settings" 
      subtitle="Manage your personal information and academic preferences."
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Avatar & Quick Info */}
          <div className="flex flex-col gap-6">
            <div className="card flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white shadow-lg">
                  {profile.name.charAt(0)}
                </div>
              </div>
              
              <h2 className="font-display text-lg font-bold text-primary-text">
                {profile.name}
              </h2>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <ShieldCheck size={14} />
                {profile.role}
              </div>
              
              <div className="mt-6 flex w-full flex-col gap-3 border-t border-border-default pt-6 text-sm">
                <div className="flex items-center gap-3 text-secondary">
                  <Mail size={16} className="text-primary shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <Target size={16} className="text-primary shrink-0" />
                  <span className="truncate">
                    {profile.academicGoal || "No academic goal set"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editable Form */}
          <div className="card lg:col-span-2">
            <div className="mb-6 flex items-center justify-between border-b border-border-default pb-4">
              <h3 className="font-display text-lg font-bold text-primary-text">
                Personal Details
              </h3>
              
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-ghost flex items-center gap-2 px-3 py-1.5 text-xs"
                >
                  <Edit2 size={14} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCancel}
                    className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  >
                    <Check size={14} />
                    Save
                  </button>
                </div>
              )}
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              {/* READ-ONLY CREDENTIALS */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Email Address (Read Only)</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary opacity-50" />
                    <input 
                      type="email" 
                      value={profile.email} 
                      disabled 
                      className="input-field cursor-not-allowed pl-10 opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary opacity-50" />
                    <input 
                      type="password" 
                      value="********" 
                      disabled 
                      className="input-field cursor-not-allowed pl-10 opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* BASIC INFO */}
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isEditing ? "text-primary" : "text-secondary"}`} />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing && "opacity-80"}`}
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* PERSONALISATION SECTION */}
              <div className="pt-2">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border-default" />
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles size={12} />
                    Personalise your experience
                  </span>
                  <div className="h-px flex-1 bg-border-default" />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label">
                      Academic Goal <span className="font-normal text-secondary lowercase">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Target size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isEditing ? "text-primary" : "text-secondary"}`} />
                      <input 
                        type="text" 
                        name="academicGoal"
                        value={formData.academicGoal} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing && "opacity-80"}`}
                        placeholder="e.g. Score 9+ CGPA this semester"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label">
                      Career Interest <span className="font-normal text-secondary lowercase">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Briefcase size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isEditing ? "text-primary" : "text-secondary"}`} />
                      <input 
                        type="text" 
                        name="careerInterest"
                        value={formData.careerInterest} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing && "opacity-80"}`}
                        placeholder="e.g. Software Developer"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label">
                      Interests <span className="font-normal text-secondary lowercase">(Comma separated)</span>
                    </label>
                    <div className="relative">
                      <Sparkles size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isEditing ? "text-primary" : "text-secondary"}`} />
                      <input 
                        type="text" 
                        name="interests"
                        value={formData.interests} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing && "opacity-80"}`}
                        placeholder="e.g. Web Development, AI, Chess"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;