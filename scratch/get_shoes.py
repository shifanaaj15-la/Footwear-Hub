import urllib.request
import re
import json

def fetch_unsplash_shoe_ids():
    url = "https://unsplash.com/s/photos/shoes"
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
        # Unsplash photo URLs are typically in the format: /photos/some-slug-photo-id
        # In modern unsplash, photo ID patterns in URLs look like: "/photos/[a-zA-Z0-9_-]+"
        # Or search in the JSON data embedded in the page
        # Let's find all photo IDs using regex.
        # Photo paths usually look like: /photos/some-description-and-id
        # Let's search for photo hrefs: href="/photos/([a-zA-Z0-9\-]+)"
        matches = re.findall(r'href="/photos/([a-zA-Z0-9\-]+)"', html)
        # Deduplicate and filter out obvious non-ids (like "license", "upload", etc.)
        photo_ids = []
        seen = set()
        for m in matches:
            if m not in seen and len(m) > 5 and not m.startswith(('join', 'login', 'terms', 'privacy', 'brand', 'advertise', 'developers', 'stats', 'press')):
                seen.add(m)
                photo_ids.append(m)
        
        print(f"Found {len(photo_ids)} photo IDs on 'shoes' search:")
        for idx, pid in enumerate(photo_ids[:30]):
            print(f"  {idx}: {pid}")
            
        # Let's also search for 'sneakers'
        url_sneakers = "https://unsplash.com/s/photos/sneakers"
        req_sn = urllib.request.Request(
            url_sneakers,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        )
        with urllib.request.urlopen(req_sn) as response:
            html_sn = response.read().decode('utf-8')
        matches_sn = re.findall(r'href="/photos/([a-zA-Z0-9\-]+)"', html_sn)
        for m in matches_sn:
            if m not in seen and len(m) > 5 and not m.startswith(('join', 'login', 'terms', 'privacy', 'brand', 'advertise', 'developers', 'stats', 'press')):
                seen.add(m)
                photo_ids.append(m)
                
        # Also 'boots'
        url_boots = "https://unsplash.com/s/photos/boots"
        req_bt = urllib.request.Request(
            url_boots,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        )
        with urllib.request.urlopen(req_bt) as response:
            html_bt = response.read().decode('utf-8')
        matches_bt = re.findall(r'href="/photos/([a-zA-Z0-9\-]+)"', html_bt)
        for m in matches_bt:
            if m not in seen and len(m) > 5 and not m.startswith(('join', 'login', 'terms', 'privacy', 'brand', 'advertise', 'developers', 'stats', 'press')):
                seen.add(m)
                photo_ids.append(m)

        print(f"Total unique photo IDs found: {len(photo_ids)}")
        with open("scratch/photo_ids.json", "w") as f:
            json.dump(photo_ids, f, indent=2)
            
    except Exception as e:
        print("Error fetching:", e)

if __name__ == "__main__":
    fetch_unsplash_shoe_ids()
