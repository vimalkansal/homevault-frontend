import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ fullName: formData.fullName });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {user?.fullName.charAt(0).toUpperCase()}
              </div>
            </div>

            <Input label="Full Name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required disabled={isLoading} />
            <Input label="Email Address" type="email" name="email" value={formData.email} disabled helperText="Email cannot be changed" />

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading || formData.fullName === user?.fullName}>Save Changes</Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Account Created:</span><span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Last Updated:</span><span className="font-medium">{user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</span></div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
