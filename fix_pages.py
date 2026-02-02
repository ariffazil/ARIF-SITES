
import json
import urllib.request
import urllib.error
import sys

# Configuration
ACCOUNT_ID = "22cc94b77b6d1d2b054be7952710e6"
API_TOKEN = "Sz46FSyxqibbrlS8LJQDiNmL2AXlpHsqqNzPH"
REPO_OWNER = "ariffazil"
REPO_NAME = "arif-fazil-sites"

PROJECTS = [
    {"name": "ariffazil", "root_dir": "body"},
    {"name": "apex", "root_dir": "soul"},
    {"name": "arifos", "root_dir": "docs"}
]

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def reconfigure_project(project):
    name = project["name"]
    root_dir = project["root_dir"]
    
    print(f"\nProcessing project: {name}...")
    
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/pages/projects/{name}"
    
    # Payload to update source config
    payload = {
        "source": {
            "type": "github",
            "config": {
                "owner": REPO_OWNER,
                "repo_name": REPO_NAME,
                "production_branch": "main",
                "pr_comments_enabled": True,
                "deployments_enabled": True
            }
        },
        "build_config": {
            "build_command": "npm install && npm run build",
            "destination_dir": "dist",
            "root_dir": root_dir
        }
    }
    
    data = json.dumps(payload).encode("utf-8")
    
    try:
        req = urllib.request.Request(url, data=data, headers=HEADERS, method="PATCH")
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode("utf-8"))
            if result.get("success"):
                print(f"✅ Success! Reconfigured '{name}' to use '{REPO_NAME}/{root_dir}'")
            else:
                print(f"❌ Failed to reconfigure '{name}'.")
                print(f"Errors: {result.get('errors')}")
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error {e.code} for '{name}'")
        try:
            error_body = e.read().decode("utf-8")
            print(f"Response: {error_body}")
        except:
            pass
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def main():
    print("Starting Cloudflare Pages Reconfiguration...")
    print(f"Account ID: {ACCOUNT_ID}")
    print(f"Repo: {REPO_OWNER}/{REPO_NAME}")
    
    # Verify token first by listing projects
    try:
        print("\nVerifying token by listing projects...")
        list_url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/pages/projects"
        req = urllib.request.Request(list_url, headers=HEADERS, method="GET")
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode("utf-8"))
            if result.get("success"):
                projects = result.get("result", [])
                print(f"✅ Token verified. Found {len(projects)} projects.")
            else:
                print("❌ Token verification failed.")
                print(f"Errors: {result.get('errors')}")
                sys.exit(1)
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error {e.code} during verification.")
        print(f"Check your Account ID and API Token.")
        try:
            print(e.read().decode("utf-8"))
        except:
            pass
        sys.exit(1)
    except Exception as e:
        print(f"❌ Connection error during verification: {str(e)}")
        sys.exit(1)

    # Proceed with reconfiguration
    for project in PROJECTS:
        reconfigure_project(project)
        
    print("\nAll tasks completed.")

if __name__ == "__main__":
    main()
