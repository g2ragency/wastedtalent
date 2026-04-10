import re

content = open('src/components/HeaderDynamic.tsx', 'r').read()

# 1. Add mobileWhite + mobileLinkStyle after linkStyle closing
old = '    };\n\n  return ('

new_code = '''    };

  const mobileWhite = isHomepage && !mobileMenuOpen && !scrolled;

  const mobileLinkStyle = {
    fontFamily: "Helvetica Neue, sans-serif",
    fontSize: "12px",
    fontWeight: "bold" as const,
    color: mobileWhite ? "white" : "#222222",
    mixBlendMode: (mobileWhite ? "difference" : "normal") as "difference" | "normal",
  };

  return ('''

content = content.replace(old, new_code, 1)

# 2. Update mobile MENU button to use mobileLinkStyle
old_menu = '''              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#222222",
              }}
            >
              {mobileMenuOpen ? "Close" : "Menu"}'''

new_menu = '''              style={mobileLinkStyle}
            >
              {mobileMenuOpen ? "Close" : "Menu"}'''

content = content.replace(old_menu, new_menu, 1)

# 3. Update mobile logo to use blend/invert on homepage
old_logo = '''              {/* Mobile logo: no blend/filter */}
              <img
                src="/logo.svg"
                alt="Wasted Talent United"
                className="block md:hidden h-[40px] w-[68px]"
              />'''

new_logo = '''              {/* Mobile logo */}
              <img
                src="/logo.svg"
                alt="Wasted Talent United"
                className="block md:hidden h-[40px] w-[68px]"
                style={{
                  mixBlendMode: mobileWhite ? "difference" : "normal",
                  filter: mobileWhite ? "invert(1)" : "none",
                }}
              />'''

content = content.replace(old_logo, new_logo, 1)

# 4. Update mobile Cart button to use mobileLinkStyle
old_cart = '''              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#222222",
              }}
            >
              Cart ({totalItems})'''

new_cart = '''              style={mobileLinkStyle}
            >
              Cart ({totalItems})'''

content = content.replace(old_cart, new_cart, 1)

open('src/components/HeaderDynamic.tsx', 'w').write(content)
print('Done!')
