import StaticPage from "../../components/StaticPage";

export const metadata = { title: "Privacy Policy | SarkariNaukri" };

export default function PrivacyPolicyPage() {
  return <StaticPage title="Privacy policy" intro="This page explains the information we collect and how we use it.">
    <p>We may receive basic technical information required to operate and secure the website. We do not ask for sensitive application information, passwords, or payment details.</p>
    <p>We use information only to maintain the service, understand aggregate usage, and respond to messages. We do not sell personal information.</p>
    <p>For privacy questions or requests, use the contact details on our Contact page.</p>
  </StaticPage>;
}
