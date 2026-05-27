#!/usr/bin/env python3
"""
Regenera los QR codes del sitio y del documento.
Ejecutar cada vez que se reinicie el servidor de ngrok.
"""

import qrcode
from urllib.parse import quote
import os

# ─── Configuración ────────────────────────────────────────────────
BASE_URL = "https://crux-resource-starfish.ngrok-free.dev"
DOC_PATH = "link/ProyectoDeInvestigación.docx"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "assets", "qr")
# ──────────────────────────────────────────────────────────────────


def make_qr(url: str, filename: str, label: str) -> None:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    path = os.path.join(OUTPUT_DIR, filename)
    img.save(path)
    print(f"  [{label}]")
    print(f"    URL  : {url}")
    print(f"    Archivo: {path}")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("\nGenerando QR codes...\n")

    make_qr(
        url=BASE_URL,
        filename="qr_sitio.png",
        label="Sitio Web",
    )

    print()

    make_qr(
        url=f"{BASE_URL}/{quote(DOC_PATH)}",
        filename="qr_documento.png",
        label="Documento (descarga)",
    )

    print("\nListo! QRs guardados en:", OUTPUT_DIR)


if __name__ == "__main__":
    main()
