import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { ProfileAvatar } from '../components/profile/ProfileAvatar';
import { AvatarUpload } from '../components/profile/AvatarUpload';
import { useUserProfile, useUpdateProfile } from '../hooks/useUser';

export const ProfilePage = () => {
  const { data: user, isLoading: isLoadingProfile, refetch } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync({ fullName: formData.fullName });
  };

  const handleAvatarUploadSuccess = () => {
    refetch();
  };

  if (isLoadingProfile) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" text="Loading profile..." />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Failed to load profile</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        {/* Avatar Section */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex justify-center md:justify-start">
              <ProfileAvatar user={user} size={96} />
            </div>
            <div className="flex-1 w-full">
              <AvatarUpload user={user} onUploadSuccess={handleAvatarUploadSuccess} />
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={updateProfileMutation.isPending}
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              disabled
              helperText="Email cannot be changed"
            />

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="submit"
                variant="primary"
                isLoading={updateProfileMutation.isPending}
                disabled={
                  updateProfileMutation.isPending || formData.fullName === user?.fullName
                }
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Account Information */}
        <Card className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Account Created:</span>
              <span className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
