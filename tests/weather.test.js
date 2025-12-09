import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const JSON_FILE = path.join(DATA_DIR, 'weather.json')
const CSV_FILE = path.join(DATA_DIR, 'weather_log.csv')

describe('Weather Data Tests', () => {
    it('weather.json exists', () => {
        expect(fs.existsSync(JSON_FILE)).toBe(true)
    })

    it('weather.json has required keys', () => {
        const raw = fs.readFileSync(JSON_FILE, 'utf8')
        expect(raw.trim().length).toBeGreaterThan(0)

        const data = JSON.parse(raw)
        expect(data).toHaveProperty('main')
        expect(data).toHaveProperty('weather')
        expect(data.weather[0]).toHaveProperty('description')
        expect(data).toHaveProperty('_last_updated_UTC')

        expect(new Date(data._last_updated_UTC).toISOString()).toBe(data._last_updated_UTC)
    })

    it('csv log exists and has header', () => {
        expect(fs.existsSync(CSV_FILE)).toBe(true)

        const csvContent = fs.readFileSync(CSV_FILE, 'utf8')
        const lines = csvContent.trim().split('\n')
        const header = lines[0].split(',')

        expect(header).toEqual(['timestamp','city','temperature','description'])
        expect(lines.length).toBeGreaterThan(1)

        const firstDataRow = lines[1].split(',')
        expect(!isNaN(parseFloat(firstDataRow[2]))).toBe(true)
    })
})