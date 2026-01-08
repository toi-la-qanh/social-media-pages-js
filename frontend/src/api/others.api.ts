/**
 * Fetch other APIs not from this application
 */
export default class OthersApi {
    /**
     * Fetch free emojis
     */
    static async getEmojis() {
        const url = "https://api.emojisworld.fr/v1/search?q=face&categories=1";
        
        return fetch(url, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*',
            },
            credentials: 'omit' 
        })
        .then(response => response.json()) 
        .then(data => {
            const emojis = data.results.map((item: any) => item.emoji); // Extract all emojis
            return JSON.parse(JSON.stringify(emojis)); 
        })
        .catch(error => {
            console.error("Error fetching emojis:", error);
            throw error; 
        });
    }
}
