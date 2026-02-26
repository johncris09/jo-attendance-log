import logo from '../../image/logo.png';
export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md   text-sidebar-primary-foreground">
                <img
                    src={logo}
                    alt="BRGY CSM Logo"
                    className="size-7 rounded-md object-cover"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Job Order Attendance Log
                </span>
            </div>
        </>
    );
}
