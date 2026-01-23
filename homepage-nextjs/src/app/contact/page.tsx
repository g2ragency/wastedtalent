import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";

export default async function ContactPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-6">
          <h1 className="text-4xl font-light mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  />
                </div>

                <button className="w-full bg-black text-white py-4 font-bold text-sm uppercase hover:bg-gray-800 transition-colors">
                  Send Message
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Email</h3>
                  <a
                    href="mailto:info@wastedtalent.com"
                    className="hover:underline"
                  >
                    info@wastedtalent.com
                  </a>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Customer Service</h3>
                  <p className="text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-sm">Sunday: Closed</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Social Media</h3>
                  <div className="flex gap-4">
                    <a href="#" className="hover:underline">
                      Instagram
                    </a>
                    <a href="#" className="hover:underline">
                      Facebook
                    </a>
                    <a href="#" className="hover:underline">
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
