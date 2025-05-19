import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function UserPage() {
    return (
        <>
            <h1 className="text-xl">Account Settings</h1>
            <div className="border border-neutral-200 rounded-md py-2 mt-4">
                <h2 className="text-lg border-b border-neutral-200 px-5 pb-2">Profile information</h2>

                <div className="border-b border-neutral-200 px-5 py-2"> 
                    <div className="grid grid-cols-1 gap-2">
                        <div className="w-full items-center grid grid-cols-1 md:grid-cols-5 gap-2">
                            <label
                                htmlFor="email"
                                className="col-span-2"
                            >Email</label>
                            <input
                                type="email"
                                id="email"
                                className="col-span-3 w-full text-sm px-2 py-1.5 border border-neutral-200 rounded-md"
                            />
                        </div>
                        <div className="w-full items-center grid grid-cols-1 md:grid-cols-5 gap-2">
                            <label
                                htmlFor="email"
                                className="col-span-2"
                            >Confirm Email</label>
                            <input
                                type="email"
                                id="email"
                                className="col-span-3 w-full text-sm px-2 py-1.5 border border-neutral-200 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-end items-center gap-1.5 px-5 pt-2">
                    <button
                        className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded px-4 py-0.5 text-sm"
                    >Cancel</button>
                    <button
                        className="bg-neutral-800 hover:bg-neutral-600 text-neutral-50 rounded px-4 py-0.5 text-sm"
                    >Save</button>
                </div>

            </div>

            <div className="border border-neutral-200 rounded-md py-2 mt-4">
                <h2 className="text-lg border-b border-neutral-200 px-5 pb-2">Security</h2>

                <div className="border-b border-neutral-200 px-5 py-2"> 
                    <div className="grid grid-cols-1 gap-2">
                        <div className="w-full items-center grid grid-cols-1 md:grid-cols-5 gap-2">
                            <label
                                htmlFor="old-password"
                                className="col-span-2"
                            >Old password</label>
                            <input
                                type="password"
                                id="old-password"
                                className="col-span-3 w-full text-sm px-2 py-1.5 border border-neutral-200 rounded-md"
                            />
                        </div>
                        <div className="w-full items-center grid grid-cols-1 md:grid-cols-5 gap-2">
                            <label
                                htmlFor="new-password"
                                className="col-span-2"
                            >New password</label>
                            <input
                                type="password"
                                id="new-password"
                                className="col-span-3 w-full text-sm px-2 py-1.5 border border-neutral-200 rounded-md"
                            />
                        </div>
                        <div className="w-full items-center grid grid-cols-1 md:grid-cols-5 gap-2">
                            <label
                                htmlFor="new-password-confirm"
                                className="col-span-2"
                            >Confirm new password</label>
                            <input
                                type="password"
                                id="new-password-confirm"
                                className="col-span-3 w-full text-sm px-2 py-1.5 border border-neutral-200 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-end items-center gap-1.5 px-5 pt-2">
                    <button
                        className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded px-4 py-0.5 text-sm"
                    >Cancel</button>
                    <button
                        className="bg-neutral-800 hover:bg-neutral-600 text-neutral-50 rounded px-4 py-0.5 text-sm"
                    >Save</button>
                </div>

            </div>

            <div className="border border-neutral-200 rounded-md py-2 mt-4">
                <h2 className="text-lg border-b border-neutral-200 px-5 pb-2">DANGER ZONE</h2>

                <div className="border border-red-200 bg-red-50 p-2 rounded-md mx-5 mt-4 my-2">
                    <div className="flex justify-start items-start gap-2 px-2 py-1">
                        <div className="hidden md:flex bg-red-500 rounded-md h-8 w-8">
                            <ExclamationTriangleIcon className="h-full w-full text-red-50 p-2" />
                        </div>
                        <div className="flex items-start flex-col max-w-2xl">
                            <span className="text-sm text-red-800">
                                Delete your account
                            </span>
                            <span className="text-sm text-neutral-600">Deleting your account is permanent and cannot be undone. Your data will be deleted within 30 days, except we may retain some metadata and logs for longer where required or permitted by law.</span>

                            <button className="mt-3 text-sm border-red-600 border rounded bg-red-400/90 text-white px-5 py-0.5 cursor-pointer">
                                Delete account
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}