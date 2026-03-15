import secrets
import string
import hashlib
import base64

def generate_code_verifier(length=43):
    # allowed characters: A-Z, a-z, 0-9 (PKCE spec also allows "-", ".", "_", "~" but Zalo requires only [A-Za-z0-9])
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_code_challenge(code_verifier):
    # Encode code verifier as ASCII
    code_verifier_bytes = code_verifier.encode('ascii')
    # SHA256 hash
    sha256_digest = hashlib.sha256(code_verifier_bytes).digest()
    # Base64 url-safe encode without padding
    base64_challenge = base64.urlsafe_b64encode(sha256_digest).decode('utf-8').rstrip('=')
    return base64_challenge

if __name__ == "__main__":
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    print(f"Code Verifier:   {code_verifier}")
    print(f"Code Challenge:  {code_challenge}")