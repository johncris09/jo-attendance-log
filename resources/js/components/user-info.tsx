import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();
    const firstName =
        typeof user.firstname === 'string' && user.firstname.trim() !== ''
            ? user.firstname.trim()
            : typeof user.FirstName === 'string' && user.FirstName.trim() !== ''
              ? user.FirstName.trim()
              : '';

    const middleName =
        typeof user.middlename === 'string' && user.middlename.trim() !== ''
            ? user.middlename.trim()
            : typeof user.MiddleName === 'string' && user.MiddleName.trim() !== ''
              ? user.MiddleName.trim()
              : '';

    const lastName =
        typeof user.lastname === 'string' && user.lastname.trim() !== ''
            ? user.lastname.trim()
            : typeof user.LastName === 'string' && user.LastName.trim() !== ''
              ? user.LastName.trim()
              : '';

    const fullNameFromFields = [firstName, middleName, lastName]
        .filter(Boolean)
        .join(' ');

    const displayName =
        fullNameFromFields !== ''
            ? fullNameFromFields
            : typeof user.name === 'string' && user.name.trim() !== ''
            ? user.name
            : typeof user.Name === 'string' && user.Name.trim() !== ''
              ? user.Name
              : typeof user.joidnum === 'string' && user.joidnum.trim() !== ''
                ? user.joidnum
                : typeof user.JOIDNUM === 'string' && user.JOIDNUM.trim() !== ''
                  ? user.JOIDNUM
                  : 'User';

    const displayEmail =
        typeof user.email === 'string' && user.email.trim() !== ''
            ? user.email
            : '';

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={displayName} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(displayName)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {displayEmail}
                    </span>
                )}
            </div>
        </>
    );
}
