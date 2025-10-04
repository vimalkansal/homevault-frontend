import { userService } from '../../services/user.service';
import { cn } from '../../utils/cn';
import type { User } from '../../types';

interface ProfileAvatarProps {
  user: User;
  size?: number;
  className?: string;
}

export const ProfileAvatar = ({ user, size = 40, className }: ProfileAvatarProps) => {
  const avatarUrl = userService.getAvatarUrl(user.avatarUrl);
  const initials = userService.getUserInitials(user.fullName);

  const sizeClasses = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size / 2.5}px`,
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center overflow-hidden',
        !avatarUrl && 'bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold',
        className
      )}
      style={sizeClasses}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user.fullName}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.parentElement) {
              e.currentTarget.parentElement.classList.add(
                'bg-gradient-to-br',
                'from-blue-500',
                'to-purple-500',
                'text-white',
                'font-bold'
              );
              e.currentTarget.parentElement.textContent = initials;
            }
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
