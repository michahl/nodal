import UserAuthButton from "@/components/auth/userbutton";
import Footer from "@/components/main/footer";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <div className="relative mx-auto flex h-dvh w-full max-w-6xl flex-col px-6 md:px-8 lg:px-12">
                <header className="flex items-center justify-between py-8">
                    <Link href="/">
                        <span className="text-neutral-950 underline underline-offset-5 decoration-wavy decoration-neutral-950">nodal</span>
                    </Link>
                    <nav>
                        <UserAuthButton />
                    </nav>
                </header>

                <main className="flex-1 mt-5 w-full max-w-4xl mx-auto">
                    <h4 className="text-2xl font-medium leading-7">Privacy Policy</h4>
                    <p className="font-light text-sm">Last updated: 24/06/2025</p>
                    <section className="mt-8">
                        <p className="mb-4">
                            nodal (“we,” “us,” or “our”) is committed to protecting your privacy. This policy describes how we collect, use, and safeguard your information when you visit <a href="https://nodal.michahl.com" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">https://nodal.michahl.com</a>.
                        </p>
                        <ol className="list-decimal list-inside space-y-2 pl-5">
                            <li>
                                <span className="font-semibold">Information We Collect:</span> We may collect personal information you provide directly to us, such as your name, email address, or other contact details when you fill out a form or contact us.
                            </li>
                        </ol>
                    </section>
                    <section className="mt-4">
                        <p className="mb-4">
                            We may also automatically collect certain information about your device and usage of the website, such as IP address, browser type, and pages visited, using cookies or similar technologies.
                        </p>
                        <ol className="list-decimal list-inside space-y-2 pl-5">
                            <li>
                                <span className="font-semibold">How We Use Your Information:</span> We use your information to:
                                <ul className="mt-1 list-disc list-inside space-y-1 pl-5">
                                    <li>Provide, operate, and maintain the website</li>
                                    <li>Respond to your inquiries</li>
                                    <li>Improve our website and services</li>
                                    <li>Analyze usage and trends</li>
                                </ul>
                            </li>
                            <li>
                                <span className="font-semibold">Sharing Your Information:</span> We do not sell or rent your personal information. We may share data with service providers who assist us in operating the website, or as required by law.
                            </li>
                            <li>
                                <span className="font-semibold">Cookies:</span> We use cookies to enhance your experience on our website. You may set your browser to refuse cookies, but some site features may not function properly.
                            </li>
                            <li>
                                <span className="font-semibold">Data Security:</span> We implement reasonable measures to protect your information from unauthorized access, disclosure, or alteration.
                            </li>
                            <li>
                                <span className="font-semibold">Your Rights:</span> Depending on your location, you may have rights to access, correct, or delete your personal information. To exercise these rights, contact us at <a href="mailto:nodal@michahl.com" className="underline underline-offset-2">nodal@michahl.com</a>.
                            </li>
                            <li>
                                <span className="font-semibold">Changes to This Policy:</span> We may update this privacy policy from time to time. The updated version will be posted on this page with a new effective date.
                            </li>
                            <li>
                                <span className="font-semibold">Contact Us:</span> If you have any questions about this Privacy Policy, please contact us at <a href="mailto:nodal@michahl.com" className="underline underline-offset-2">nodal@michahl.com</a>.
                            </li>
                        </ol>
                    </section>
                </main>

                <Footer />

            </div>
        </>
    )
}