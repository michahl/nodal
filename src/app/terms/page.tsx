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
                    <h4 className="text-2xl font-medium leading-7">Terms of Service</h4>
                    <p className="font-light text-sm">Last updated: 24/06/2025</p>
                    <section className="mt-8">
                        <p className="mb-8">
                            Welcome to nodal (https://nodal.michahl.com). By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using our site.
                        </p>
                        <ol className="list-decimal list-inside space-y-2 pl-5">
                            <li>
                                <strong>Acceptance of Terms:</strong> By accessing or using nodal, you agree to these Terms of Service. If you do not agree with any part of these terms, please do not use our website.
                            </li>
                            <li>
                                <strong>Use of the Website:</strong> You may use this website for lawful purposes only. You agree not to use the site in any way that may damage, disable, overburden, or impair the website or interfere with any other party's use.
                            </li>
                            <li>
                                <strong>Intellectual Property:</strong> All content on this website, including text, graphics, logos, and software, is the property of nodal or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any material on this site without our prior written consent.
                            </li>
                            <li>
                                <strong>User Content:</strong> If you submit any content to the website, you grant nodal a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content as necessary for the operation of the site.
                            </li>
                            <li>
                                <strong>Third-Party Links:</strong> Our website may contain links to third-party websites. nodal is not responsible for the content or privacy practices of these external sites.
                            </li>
                            <li>
                                <strong>Disclaimer:</strong> The website is provided “as is” and “as available.” We make no warranties, express or implied, regarding the website's accuracy, reliability, or availability.
                            </li>
                            <li>
                                <strong>Limitation of Liability:</strong> To the fullest extent permitted by law, nodal shall not be liable for any damages arising out of or in connection with your use of the website.
                            </li>
                            <li>
                                <strong>Changes to Terms:</strong> We reserve the right to update or modify these terms at any time. Changes will be posted on this page, and your continued use of the site constitutes acceptance of those changes.
                            </li>
                            <li>
                                <strong>Governing Law:</strong> These terms are governed by and construed in accordance with the laws of Greece, without regard to its conflict of law principles.
                            </li>
                            <li>
                                <strong>Contact:</strong> For any questions regarding these terms, please contact us at <a href="mailto:nodal@michahl.com" className="underline">nodal@michahl.com</a>.
                            </li>
                        </ol>
                    </section>
                </main>

                <Footer />

            </div>
        </>
    )
}