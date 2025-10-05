// src/components/PlanetaryComputerAPI.jsx

const STAC_SEARCH_URL = "https://planetarycomputer.microsoft.com/api/stac/v1/search";
// Esta es la URL base para la API de DATOS, no la de búsqueda.
const DATA_API_BASE_URL = "https://planetarycomputer.microsoft.com/api/data/v1/collections";

export const findBestSentinel2Image = async (polygon) => {
    console.log("Buscando imagen para el polígono:", polygon);

    const searchPayload = {
        "collections": ["sentinel-2-l2a"],
        "intersects": {
            "type": "Polygon",
            "coordinates": [polygon]
        },
        "datetime": "2024-01-01T00:00:00Z/2024-06-30T23:59:59Z",
        "query": { "eo:cloud_cover": { "lt": 10 } },
        "sortby": [{ "field": "properties.eo:cloud_cover", "direction": "asc" }],
        "limit": 1
    };

    try {
        // --- PASO 1: Buscar la imagen para obtener su ID y Colección (igual que antes) ---
        const stacResponse = await fetch(STAC_SEARCH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(searchPayload)
        });
        if (!stacResponse.ok) throw new Error(`API STAC respondió con ${stacResponse.status}`);
        const stacData = await stacResponse.json();
        
        if (stacData.features.length === 0) {
            console.warn("No se encontraron imágenes.");
            return null;
        }

        const stacItem = stacData.features[0];
        const collectionId = stacItem.collection;
        const itemId = stacItem.id;

        // --- PASO 2: Construir la URL a la API de DATOS y obtener el item con enlaces firmados ---
        const dataApiUrl = `${DATA_API_BASE_URL}/${collectionId}/items/${itemId}`;
        console.log("Consultando la API de Datos para obtener el enlace firmado:", dataApiUrl);

        const dataApiResponse = await fetch(dataApiUrl);
        if (!dataApiResponse.ok) throw new Error(`API de Datos respondió con ${dataApiResponse.status}`);
        const signedItem = await dataApiResponse.json();

        // --- PASO 3: Extraer la URL ya firmada del activo "visual" ---
        const signedUrl = signedItem.assets.visual.href;
        console.log("✅ URL firmada y lista para usar:", signedUrl);
        
        return signedUrl;

    } catch (error) {
        console.error("Error al procesar con Planetary Computer:", error);
        return null;
    }
};