import httpx
from typing import List, Dict, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.core.config import settings

router = APIRouter(prefix="/translate", tags=["translate"])

class TranslateRequest(BaseModel):
    text: str
    target_lang: str
    source_lang: Optional[str] = "auto"

class BatchTranslateRequest(BaseModel):
    texts: List[str]
    target_lang: str
    source_lang: Optional[str] = "auto"

class TranslateResponse(BaseModel):
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    provider: str

class BatchTranslateResponse(BaseModel):
    translations: List[Dict[str, str]]
    source_lang: str
    target_lang: str
    provider: str

SUPPORTED_LANGUAGES = [
    {"code": "en", "name": "English", "native": "English", "flag": "🇬🇧"},
    {"code": "hi", "name": "Hindi", "native": "हिन्दी", "flag": "🇮🇳"},
    {"code": "bn", "name": "Bengali", "native": "বাংলা", "flag": "🇮🇳"},
    {"code": "pa", "name": "Punjabi", "native": "ਪੰਜਾਬੀ", "flag": "🇮🇳"},
    {"code": "te", "name": "Telugu", "native": "తెలుగు", "flag": "🇮🇳"},
    {"code": "ta", "name": "Tamil", "native": "தமிழ்", "flag": "🇮🇳"},
    {"code": "mr", "name": "Marathi", "native": "मराठी", "flag": "🇮🇳"},
    {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી", "flag": "🇮🇳"},
    {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ", "flag": "🇮🇳"},
    {"code": "ml", "name": "Malayalam", "native": "മലയാളം", "flag": "🇮🇳"},
    {"code": "or", "name": "Odia", "native": "ଓଡ଼ିଆ", "flag": "🇮🇳"},
    {"code": "ur", "name": "Urdu", "native": "اردو", "flag": "🇮🇳"},
]

@router.get("/languages")
async def get_languages():
    """Returns list of supported agricultural platform languages"""
    return {
        "status": "success",
        "default": "en",
        "languages": SUPPORTED_LANGUAGES
    }

@router.post("/text", response_model=TranslateResponse)
async def translate_single_text(req: TranslateRequest):
    """
    Translates text to target language using Google Translate API.
    """
    text = req.text.strip()
    if not text:
        return TranslateResponse(
            original_text="",
            translated_text="",
            source_lang=req.source_lang or "en",
            target_lang=req.target_lang,
            provider="noop"
        )

    # If target is English and source is English, return original
    if req.target_lang == "en" and req.source_lang in ["en", "auto"]:
        return TranslateResponse(
            original_text=text,
            translated_text=text,
            source_lang="en",
            target_lang="en",
            provider="identity"
        )

    # 1. Try Google Translate API
    try:
        url = "https://translate.googleapis.com/translate_a/single"
        params = {
            "client": "gtx",
            "sl": req.source_lang or "auto",
            "tl": req.target_lang,
            "dt": "t",
            "q": text,
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.get(url, params=params)
            if res.status_code == 200:
                data = res.json()
                # data[0] contains array of sentence translation segments [[translated, original], ...]
                translated_segments = []
                detected_src = data[2] if len(data) > 2 and data[2] else req.source_lang or "en"
                
                if isinstance(data, list) and len(data) > 0 and isinstance(data[0], list):
                    for segment in data[0]:
                        if isinstance(segment, list) and len(segment) > 0 and segment[0]:
                            translated_segments.append(segment[0])
                    
                    full_translated = "".join(translated_segments)
                    if full_translated.strip():
                        return TranslateResponse(
                            original_text=text,
                            translated_text=full_translated,
                            source_lang=detected_src,
                            target_lang=req.target_lang,
                            provider="google_translate_api"
                        )
    except Exception as e:
        print(f"Google translate error: {e}")

    # Fallback return original text if translation service is unreachable
    return TranslateResponse(
        original_text=text,
        translated_text=text,
        source_lang=req.source_lang or "en",
        target_lang=req.target_lang,
        provider="fallback"
    )

@router.post("/batch", response_model=BatchTranslateResponse)
async def translate_batch_texts(req: BatchTranslateRequest):
    """
    Translates multiple strings in batch.
    """
    results = []
    if not req.texts:
        return BatchTranslateResponse(
            translations=[],
            source_lang=req.source_lang or "auto",
            target_lang=req.target_lang,
            provider="noop"
        )

    # Query Google Translate API
    for text in req.texts:
        if not text.strip() or req.target_lang == "en":
            results.append({"original": text, "translated": text})
            continue

        try:
            url = "https://translate.googleapis.com/translate_a/single"
            params = {
                "client": "gtx",
                "sl": req.source_lang or "auto",
                "tl": req.target_lang,
                "dt": "t",
                "q": text,
            }
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    segments = [s[0] for s in data[0] if isinstance(s, list) and len(s) > 0 and s[0]]
                    trans = "".join(segments)
                    results.append({"original": text, "translated": trans or text})
                else:
                    results.append({"original": text, "translated": text})
        except Exception:
            results.append({"original": text, "translated": text})

    return BatchTranslateResponse(
        translations=results,
        source_lang=req.source_lang or "auto",
        target_lang=req.target_lang,
        provider="google_translate_api"
    )
