const API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "http://wasted-talent.local/wp-json/site-manager/v1";

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  target: string;
  classes: string;
}

export interface HeaderData {
  left_menu: MenuItem[];
  right_menu: MenuItem[];
}

export interface SlideData {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  background_image: string;
}

export interface HeroData {
  slides: SlideData[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  image: string;
  permalink: string;
  in_stock: boolean;
}

export interface FeaturedProductsData {
  title: string;
  products: Product[];
}

export interface AboutSectionData {
  text: string;
  images: string[];
  gallery: string[];
  products: Product[];
}

export interface AboutData {
  manifesto: AboutSectionData;
  visione: AboutSectionData;
}

export interface HomepageData {
  header: HeaderData;
  hero: HeroData;
  featured_products: FeaturedProductsData;
  about_section: AboutData;
}

// Fetch header
export async function getHeaderData(): Promise<HeaderData> {
  try {
    const res = await fetch(`${API_URL}/header`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch header data");
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching header data:", error);
    return {
      left_menu: [],
      right_menu: [],
    };
  }
}

// Fetch tutte le impostazioni homepage
export async function getHomepageData(): Promise<HomepageData> {
  try {
    const res = await fetch(`${API_URL}/settings`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch homepage data");
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      header: {
        left_menu: [],
        right_menu: [],
      },
      hero: {
        slides: [],
      },
      featured_products: {
        title: "Prodotti in evidenza",
        products: [],
      },
      about_section: {
        manifesto: { text: "", images: [], gallery: [], products: [] },
        visione: { text: "", images: [], gallery: [], products: [] },
      },
    };
  }
}

// Fetch solo hero section
export async function getHeroData(): Promise<HeroData> {
  try {
    const res = await fetch(`${API_URL}/hero`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch hero data");
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return {
      slides: [],
    };
  }
}

// Fetch prodotti in evidenza
export async function getFeaturedProducts(): Promise<FeaturedProductsData> {
  try {
    const res = await fetch(`${API_URL}/featured-products`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch featured products");
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      title: "Prodotti in evidenza",
      products: [],
    };
  }
}

// Fetch about section
export async function getAboutData(): Promise<AboutData> {
  try {
    const res = await fetch(`${API_URL}/about`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch about data");
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching about data:", error);
    return {
      manifesto: { text: "", images: [], gallery: [], products: [] },
      visione: { text: "", images: [], gallery: [], products: [] },
    };
  }
}

// WooCommerce Product Interface
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  description: string;
  short_description: string;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stock_status: string;
  in_stock: boolean;
}

// Get WooCommerce API base URL
const WC_API_URL = process.env.NEXT_PUBLIC_WP_API_URL
  ? process.env.NEXT_PUBLIC_WP_API_URL.replace("/site-manager/v1", "/wc/v3")
  : "http://wasted-talent.local/wp-json/wc/v3";

// Fetch all products from WooCommerce via API route
export async function getProducts(): Promise<WooCommerceProduct[]> {
  try {
    // Use Site Manager API endpoint instead of WooCommerce directly
    const res = await fetch(`${API_URL}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("API Route Error:", error);
      return [];
    }

    const products = await res.json();
    console.log("Products fetched via API route:", products.length);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Fetch single product by slug
export async function getProductBySlug(
  slug: string,
): Promise<WooCommerceProduct | null> {
  try {
    // Use Site Manager API endpoint
    const res = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Product API Error:", res.status, errorText);
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const product = await res.json();
    return product || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Lookbook interfaces
export interface LookbookItem {
  id: number;
  title: string;
  slug: string;
  year: string;
  cover_image: string;
}

export interface LookbookDetail {
  id: number;
  title: string;
  slug: string;
  year: string;
  cover_image: string;
  gallery: string[];
}

// Fetch lookbooks list
export async function getLookbooks(): Promise<LookbookItem[]> {
  try {
    const res = await fetch(`${API_URL}/lookbooks`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch lookbooks");
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching lookbooks:", error);
    return [];
  }
}

// Fetch single lookbook by slug
export async function getLookbookBySlug(
  slug: string,
): Promise<LookbookDetail | null> {
  try {
    const res = await fetch(`${API_URL}/lookbooks/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch lookbook: ${res.status}`);
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching lookbook:", error);
    return null;
  }
}

// Contact
export interface ContactData {
  cf7_shortcode: string;
  cf7_form_id: number;
  form_html: string;
  address: string;
  email: string;
  phone: string;
  social_instagram: string;
  social_facebook: string;
  social_spotify: string;
}

export async function getContactData(): Promise<ContactData> {
  try {
    const res = await fetch(`${API_URL}/contacts`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch contacts: ${res.status}`);
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return { cf7_shortcode: "", cf7_form_id: 0, form_html: "", address: "", email: "", phone: "", social_instagram: "", social_facebook: "", social_spotify: "" };
  }
}

// Contact Info (site-wide: footer, contact page, etc.)
export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  social_instagram: string;
  social_facebook: string;
  social_spotify: string;
}

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const res = await fetch(`${API_URL}/contact-info`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch contact info: ${res.status}`);
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return {
      address: "",
      email: "",
      phone: "",
      social_instagram: "",
      social_facebook: "",
      social_spotify: "",
    };
  }
}
