import React from 'react';
import { Cookie, Settings, Shield, Info } from 'lucide-react';

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <Cookie size={48} className="mx-auto text-primary-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Settings size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">Essential Cookies</h3>
                    <p className="text-blue-800 text-sm">
                      These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and form submissions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Info size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900 mb-2">Analytics Cookies</h3>
                    <p className="text-green-800 text-sm">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Shield size={20} className="text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-purple-900 mb-2">Preference Cookies</h3>
                    <p className="text-purple-800 text-sm">
                      These cookies remember your choices and preferences to provide you with a more personalized experience.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Cookie Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Purpose</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">session_id</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Maintains your login session</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">user_preferences</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Stores your preferences and settings</td>
                      <td className="px-4 py-3 text-sm text-gray-700">1 year</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">analytics_id</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Tracks website usage for analytics</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2 years</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">search_history</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Remembers your recent searches</td>
                      <td className="px-4 py-3 text-sm text-gray-700">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                We may also use third-party cookies from trusted partners for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Analytics and performance monitoring</li>
                <li>Social media integration</li>
                <li>Payment processing</li>
                <li>Customer support tools</li>
              </ul>
              <p className="text-gray-700 mb-4">
                These third-party services have their own privacy policies and cookie practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Your Cookie Preferences</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Settings size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900 mb-2">Browser Settings</h3>
                    <p className="text-yellow-800 text-sm">
                      You can control cookies through your browser settings. Most browsers allow you to block or delete cookies, though this may affect website functionality.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Manage Cookies in Popular Browsers:</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Chrome</h4>
                  <p className="text-sm text-gray-700">
                    Settings → Privacy and security → Cookies and other site data
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Firefox</h4>
                  <p className="text-sm text-gray-700">
                    Options → Privacy & Security → Cookies and Site Data
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Safari</h4>
                  <p className="text-sm text-gray-700">
                    Preferences → Privacy → Manage Website Data
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Edge</h4>
                  <p className="text-sm text-gray-700">
                    Settings → Cookies and site permissions → Cookies and site data
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Impact of Disabling Cookies</h2>
              <p className="text-gray-700 mb-4">
                If you choose to disable cookies, some features of our website may not work properly:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>You may need to log in repeatedly</li>
                <li>Your preferences and settings may not be saved</li>
                <li>Some personalized content may not be available</li>
                <li>Website performance may be affected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@pgfinder.com<br />
                  <strong>Address:</strong> 123 Main Street, City, State 12345<br />
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600 text-center">
              By continuing to use our website, you consent to our use of cookies as described in this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies; 