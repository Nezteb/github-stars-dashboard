import axios from 'axios'
import pick from 'lodash/pick.js';
import omit from 'lodash/omit.js';
import {
    readFile as readFileCallback,
    writeFileSync
} from 'fs';
import { promisify } from 'util';
const readFile = promisify(readFileCallback);

const skipTopics = false

const fileName = "stars.json"

const starsKeys = [
    "starred_at",
    "repo.id",
    "repo.name",
    "repo.owner.login",
    "repo.html_url",
    "repo.homepage",
    "repo.description",
    "repo.stargazers_count",
    "repo.language",
]

const perPage = 50

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getStars = async (githubToken: string, page: number): Promise<any> => {
    return await axios({
        method: "get",
        url: `https://api.github.com/user/starred?per_page=${perPage}&page=${page}`,
        headers: {
            Authorization: `Bearer ${githubToken}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3.star+json"
        }
    })
}

// owner: string, repo: string
const getRepoTopics = async (githubToken: string, star: any): Promise<any> => {
    return await axios({
        method: "get",
        url: `https://api.github.com/repositories/${star.repo.id}/topics`,
        headers: {
            Authorization: `Bearer ${githubToken}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.mercy-preview+json",
        }
    })
}

const getOneStar = async (githubToken: string, fullStar: any) => {
    let star = pick(fullStar, starsKeys)

    star.fullname = `${star.repo.owner.login}/${star.repo.name}`

    // Topics requires a ton of API calls, so maybe don't...
    if (!skipTopics) {
        try {
            const { data: labelsListObj } = await getRepoTopics(githubToken, star)
            const { names: labelsList } = labelsListObj
            const labels = labelsList.join(", ")
            star.labels = labels
        } catch (error: any) {
            console.error(`ERROR: ${star.fullname}, ${error.response.status}, ${error.response.statusText}, ${error.response.data}`);
            star.labels = null
        }
    }

    star = omit(star, ["repo.id", "repo.owner", "repo.name"])

    // Hack to unnest the "repo" object
    const repo = star.repo
    star = omit(star, "repo")
    return { ...star, ...repo }
}

const sort_by_starred_at = (a: any, b: any) => {
    // Newest first
    return new Date(b.starred_at).getTime() - new Date(a.starred_at).getTime();
}

(async function () {
    console.log(`Starting...`)
    const githubToken = process.env.GITHUB_TOKEN!
    let page = 1
    let total = 0
    writeFileSync(fileName, JSON.stringify([], null, 2), 'utf-8');

    while (total < 2000) {
        console.log(`Getting stars page: ${page} (total: ${total})`)

        let starsListForPage = []
        try {
            const { data } = await getStars(githubToken, page)
            starsListForPage = data
        } catch (error: any) {
            console.error(error.response.status, error.response.statusText, JSON.stringify(error.response.data));
            break;
        }

        const allStarsForPage = await Promise.all(starsListForPage.map((star: any) => {
            return getOneStar(githubToken, star)
        }))
        total += allStarsForPage.length

        if (allStarsForPage === undefined || allStarsForPage.length < 1) {
            break
        }
        const fileContent = await readFile(fileName, 'utf-8')
        const fileJson = JSON.parse(fileContent);
        fileJson.push(...allStarsForPage)
        writeFileSync(fileName, JSON.stringify(fileJson, null, 2), 'utf-8')
        page++

        console.log("Sleeping for 5 seconds to avoid triggering GitHub abuse detection...")
        await delay(5000);
    }

    console.log("Sorting...")
    const fileContent = await readFile(fileName, 'utf-8')
    const fileJson = JSON.parse(fileContent);
    fileJson.sort(sort_by_starred_at);
    writeFileSync(fileName, JSON.stringify(fileJson, null, 2), 'utf-8')
})();
