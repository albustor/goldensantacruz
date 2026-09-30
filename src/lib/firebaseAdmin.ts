import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

const MASTER_CREDENTIAL = {
  type: "service_account",
  project_id: "curiol-studio",
  private_key_id: "3ca1ae40dd28461bd061e839c43a5c2620774c68",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC+u0TdnK/Q7mbK\nn4dW1Gun3FjCeNXl+K/jzmRjopoI4J26ZFNhZx4LJcEl0WnonXY+JHPmKi5gNuKI\nsKWtqbm2l/wyFijPXBMPq2PNt7gPokeuqbMKuLezoHOTCJNnO9LHgXKM6c3QdxB0\nLhHiEpsaUv3Dsot68U+mmhd2ibbLNIyp/oNoipTDwZiHf5mc4Es5n8214Epw9HzG\na1HMqd9rHCSK6UhIhpHPakywF6wXtijnr304l55PDCPXRWWPcbjmPRUq/uRaC5jZ\nyRu3wQK3K2VO9RL/W45/KF2NYLDStJHFbVoI0BhPaSDS0xMffvMvrvlAK7vfWMNI\nI9FLjVMbAgMBAAECggEAKYSmVv9WnkpnAdB8K4CN9rpWb+7R0P+zeglhfPbWRPxw\nGTThmaBSv+Z2Bv9w6HvuU1SoDgA8nCEWat7ZEdaSYJbxBQ4h0BGg7JZIYW2OmYif\nxfuWx8yx4F4bCnShcaVqGpepEdeLP8fLQx8MMYQPU0mhh8oD5r1Es2VzmhAcRFtJ\n1sMMAZh82L+fwSPB/5jUfHXyK5jgyfH4qyPiaaUfzp/nFwHCpWPovoqdrFCap401\n4D7ucCXDV9pMnb6ze2LKGqoJJ/W7t0ihYXhdptaf7QvQU+/nmmLp/Qwr3WyG7Lna\nw8z4VhlJzIfZpg7U+sdEmcfvnuA+DfraqjI5mLpHcQKBgQDe9tf0qoE2SCXWsdF7\nP+wo2F/NkY+pka79W+NBR2VQD1bOCELIcbdoS+W04k13ykD3jzqHKOiNO9gO93eL\n90T2SLP5M/BW8UWuRlgaAgYz8NG9dN8fBfWzSnA86B8UcXQ62HuaE9rn17XvWqim\nB8pVC+jSh75JT97ma47PD6Q8rwKBgQDa/dIhsstYEoP0EPp4mdfjQ091JmCzMmnz\nUcH/jaNtBEcDDQZwNN2fi9sVOJeVKmVpYPvt7k2QYc7UKiTAnR9rIGLj3qwBa/84\nT5QxtV2pIfHpCCC6ZvWWTHmp0pPmN9Ihx4QtOKbztbku/qKZ/1UE6JUjC4zVii\n8X4Y4DlKrjVQKBgDAhMt7iy3+vNVPSELk9RDpQ8uVKLavaAd85LaZSxiDxHrjc+a\nWRPpkqAQz56OUZ6MpHxceVYhXSvEIG02yIVP+hFBCQUKpD7NnA35XFqBcgPfZauy\ntUOwSX5gCPzt232/Iz9wJ8lL2FSAXCGTO17MxNBNYlbUMgFarBvxMdekOLAoGAUI\nGxZ3wQb09XPTmkqwN7r2vGYT37nMUy2CW9WRKb+u7woDmAnW2B8C59Gx8T8t2ELK\npf04eg8ixS2gKoQjtBGqPsVvM8bsViLTRsOZ4AUbZN9apsRbqmHFv++iSVBLSOxq\nZPfERwc/Xhn1ozMsQAYG6UrS6I1tQXHgNorv5PmIUCgYAq8JWZWReE/7WMOf7s5/\nXFWiU763iYRjXotYBZ0DFXaLbo6Su1ycDp2ZrgCL/bzYgDuNtGVQqGSnD4AMB6c3\n5BBALXyGegxAbNKvb2jp6yQkJ3BpVNzYl/6M3UnN4fxifjkXmcPWyYowymIsMf7m\nasFEswIxBjfDpT5j+xFNztxg==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@curiol-studio.iam.gserviceaccount.com"
};

function getServiceAccount(): any {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch {
      // Fallback
    }
  }
  return MASTER_CREDENTIAL;
}

let adminApp: App;
if (getApps().length === 0) {
  adminApp = initializeApp({
    credential: cert(getServiceAccount())
  });
} else {
  adminApp = getApps()[0];
}

export const curiolDb: Firestore = getFirestore(adminApp);
