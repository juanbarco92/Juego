"""
Script para generar audios de alta fidelidad con ElevenLabs para Emma Aprende.

Instrucciones:
1. Regístrate gratis en https://elevenlabs.io
2. Copia tu API key de tu perfil.
3. Ejecuta en terminal:
   python scripts/generate_elevenlabs_audio.py --api-key TU_API_KEY
   (Opcional) --voice-id ID_DE_VOZ (por defecto usa una voz suave/maternal)
"""

import os
import sys
import argparse
import urllib.request
import json

WORDS = [
    ("amigos", "amigos"),
    ("avion", "avión"),
    ("barco", "barco"),
    ("barrer", "barrer"),
    ("bebe", "bebé"),
    ("bicicleta", "bicicleta"),
    ("bote", "bote"),
    ("brocoli", "brócoli"),
    ("calabaza", "calabaza"),
    ("cansado", "cansado"),
    ("caracol", "caracol"),
    ("carro", "carro"),
    ("cebolla", "cebolla"),
    ("cepillar", "cepillar"),
    ("comer", "comer"),
    ("conejo", "conejo"),
    ("dormir", "dormir"),
    ("emma", "Emma"),
    ("empujar", "empujar"),
    ("escuela", "escuela"),
    ("flor", "flor"),
    ("fresa", "fresa"),
    ("galleta", "galleta"),
    ("gallo", "gallo"),
    ("gato", "gato"),
    ("globo", "globo"),
    ("guantes", "guantes"),
    ("helado", "helado"),
    ("huevo", "huevo"),
    ("jabon", "jabón"),
    ("jardin", "jardín"),
    ("jirafa", "jirafa"),
    ("lampara", "lámpara"),
    ("leche", "leche"),
    ("libros", "libros"),
    ("lobo", "lobo"),
    ("mama", "mamá"),
    ("manzana", "manzana"),
    ("medico", "médico"),
    ("mesa", "mesa"),
    ("negro", "negro"),
    ("orejas", "orejas"),
    ("oso", "oso"),
    ("pan", "pan"),
    ("papa", "papá"),
    ("pelota", "pelota"),
    ("perro", "perro"),
    ("platano", "plátano"),
    ("pollito", "pollito"),
    ("robot", "robot"),
    ("sofa", "sofá"),
    ("sol", "sol"),
    ("tambor", "tambor"),
    ("televisor", "televisor"),
    ("tigre", "tigre"),
    ("tren", "tren"),
    ("uvas", "uvas"),
    ("vestir", "vestir"),
    ("yogur", "yogur"),
]

PRAISES = [
    ("praise_1", "¡Muy bien!"),
    ("praise_2", "¡Excelente!"),
    ("praise_3", "¡Qué bien!"),
    ("praise_4", "¡Genial!"),
    ("praise_5", "¡Eso es!"),
    ("praise_6", "¡Lo hiciste increíble!"),
    ("praise_7", "¡Bravo Emma!"),
    ("praise_8", "¡Maravilloso!"),
]

# Default warm multilingual voice ID in ElevenLabs (e.g. "Bella" or "Rachel")
DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # Bella / Warm & Gentle

def generate_elevenlabs_clip(text, voice_id, api_key, output_path):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.2,
            "use_speaker_boost": True
        }
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
    with urllib.request.urlopen(req) as resp:
        audio_data = resp.read()
        with open(output_path, "wb") as f:
            f.write(audio_data)

def main():
    parser = argparse.ArgumentParser(description="Generador de audios ElevenLabs para Emma Aprende")
    parser.add_argument("--api-key", required=True, help="Tu ElevenLabs API key")
    parser.add_argument("--voice-id", default=DEFAULT_VOICE_ID, help="Voice ID de ElevenLabs")
    args = parser.parse_args()

    words_dir = os.path.join("audio", "words")
    praise_dir = os.path.join("audio", "praise")
    os.makedirs(words_dir, exist_ok=True)
    os.makedirs(praise_dir, exist_ok=True)

    print(f"🎙️ Generando {len(WORDS)} palabras con ElevenLabs...")
    for key, text in WORDS:
        out_path = os.path.join(words_dir, f"{key}.mp3")
        try:
            generate_elevenlabs_clip(text, args.voice_id, args.api_key, out_path)
            print(f"  [OK] {key} -> '{text}'")
        except Exception as e:
            print(f"  [ERROR] {key}: {e}")

    print(f"\n🎉 Generando {len(PRAISES)} elogios con ElevenLabs...")
    for key, text in PRAISES:
        out_path = os.path.join(praise_dir, f"{key}.mp3")
        try:
            generate_elevenlabs_clip(text, args.voice_id, args.api_key, out_path)
            print(f"  [OK] {key} -> '{text}'")
        except Exception as e:
            print(f"  [ERROR] {key}: {e}")

    print("\n✅ ¡Todos los audios de ElevenLabs generados con éxito!")

if __name__ == "__main__":
    main()
