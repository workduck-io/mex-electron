import json
import os
import requests

from pathlib import Path

PACKAGE_JSON_PATH = Path("package.json")
MAKE_ASSETS_PATH = Path("out/make")


class ERSClient:

    __token: str
    __baseURL: str
    __releaseName: str
    __headers: dict

    def __init__(self, username: str, password: str, baseURL: str):
        self.__baseURL = baseURL
        self.__token = self.fetchToken(username, password)

    def fetchToken(self, username, password):
        URL = f"{self.__baseURL}/api/auth/login"

        reqBody = {"username": username, "password": password}

        r = requests.post(URL, json=reqBody)
        return r.json()["token"]

    def check_existing_version(self, version):
        URL = f"{self.__baseURL}/api/version"
        self.__headers = {
            "Authorization": f"Bearer {self.__token}",
        }

        data = requests.get(URL, headers=self.__headers).json()
        versions = [i["name"] for i in data]

        return True if version in versions else False

    def create_release(self, version: str, channel: str = "stable"):
        if self.check_existing_version(version):
            raise RuntimeError(f"Version {version} already exists")

        URL = f"{self.__baseURL}/api/version"

        body = {"channel": {"name": channel}, "name": version}

        r = requests.post(URL, json=body, headers=self.__headers)

        if r.status_code >= 400:
            raise RuntimeError(f"Error creating new release: {r.text}")

        self.__releaseName = version
        return r.json()

    def add_asset(self, path: Path, platform: str):
        fileName = path.name
        URL = f"{self.__baseURL}/api/asset"

        files = [("file", (fileName, open(path, "rb")))]

        payload = {
            "token": self.__token,
            "platform": platform,
            "version": f"{self.__releaseName}_default",
        }

        r = requests.post(URL, headers=self.__headers, data=payload, files=files)
        return r.json()


if __name__ == "__main__":

    username = os.getenv("ERS_USERNAME")
    password = os.getenv("ERS_PASSWORD")
    baseURL = os.getenv("ERS_BASE_URL")

    if not (username and password and baseURL):
        raise RuntimeError("Add ERS_USERNAME, ERS_PASSWORD and ERS_BASE_URL environment variables")

    with open(PACKAGE_JSON_PATH) as f:
        package = json.load(f)
        version: str = package["version"]
        channel = "alpha" if "alpha" in version else "stable"

    client = ERSClient(username, password, baseURL)
    release = client.create_release(version, channel)
    print("Created Release: ", release["id"])

    assets = os.listdir(MAKE_ASSETS_PATH)

    for asset in assets:
        path = MAKE_ASSETS_PATH / asset
        platform = "osx_arm64" if "-arm64" in asset else "osx_64"
        asset = client.add_asset(path, platform)
        print("Added Asset: ", asset)
