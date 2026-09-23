import os
import sys
import asyncio
import edge_tts

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

VOICE = "es-CO-SalomeNeural"
RATE = "-6%"  # Slightly relaxed rate for toddler comprehension

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

async def generate_file(text, output_path):
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(output_path)

async def main():
    words_dir = os.path.join("audio", "words")
    praise_dir = os.path.join("audio", "praise")
    os.makedirs(words_dir, exist_ok=True)
    os.makedirs(praise_dir, exist_ok=True)

    print(f"🎙️ Generando {len(WORDS)} palabras con la voz {VOICE}...")
    for key, text in WORDS:
        out_path = os.path.join(words_dir, f"{key}.mp3")
        try:
            await generate_file(text, out_path)
            print(f"  [OK] {key} -> '{text}'")
        except Exception as e:
            print(f"  [ERROR] {key}: {e}")

    print(f"\n🎉 Generando {len(PRAISES)} frases de felicitación...")
    for key, text in PRAISES:
        out_path = os.path.join(praise_dir, f"{key}.mp3")
        try:
            await generate_file(text, out_path)
            print(f"  [OK] {key} -> '{text}'")
        except Exception as e:
            print(f"  [ERROR] {key}: {e}")

    print("\n✅ ¡Todos los audios generados exitosamente!")

if __name__ == "__main__":
    asyncio.run(main())
