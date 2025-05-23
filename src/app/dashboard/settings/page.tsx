import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function UserPage() {
    return (
        <>
            <h1 className="text-xl">Account Settings</h1>

            <div className="border border-neutral-200 rounded-md py-2 mt-4">
                <h2 className="text-sm text-neutral-700 border-b border-neutral-200 px-5 pb-2">DANGER ZONE</h2>

                <div className="border border-red-200 bg-red-50 p-2 rounded-md mx-5 mt-4 my-2">
                    <div className="flex justify-start items-start gap-2 px-2 py-1">
                        <div className="hidden md:flex bg-red-500 rounded-md h-8 w-8">
                            <ExclamationTriangleIcon className="h-full w-full text-red-50 p-2" />
                        </div>
                        <div className="flex items-start flex-col max-w-2xl">
                            <span className="text-sm text-red-800">
                                Delete your account
                            </span>
                            <span className="text-sm text-neutral-600">
                                Deleting your account is permanent and cannot be undone. Your data will be deleted immediately and you will lose access to all your saved data.
                            </span>

                            <p className="mt-3 text-sm rounded bg-red-200 text-red-500 px-5 py-0.5">
                                Contact <a href="mailto:nodal@michahl.com" className="font-medium">nodal@michahl.com</a> to request account deletion
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}