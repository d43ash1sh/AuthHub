import puppeteer from 'puppeteer';
import { User, PinnedRepository } from "@shared/schema";
import { GitHubUser, GitHubRepository, ContributionStats } from './github';

export interface ResumeData {
  user: User;
  githubProfile: GitHubUser;
  pinnedRepositories: PinnedRepository[];
  topRepositories: GitHubRepository[];
  contributionStats: ContributionStats;
  languageStats: { [key: string]: number };
}

export class PDFService {
  private generateResumeHTML(data: ResumeData): string {
    const { user, githubProfile, pinnedRepositories, topRepositories, contributionStats, languageStats } = data;

    const topLanguages = Object.entries(languageStats)
      .slice(0, 5)
      .map(([lang, percentage]) => `${lang} (${percentage}%)`)
      .join(', ');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>GitHub Portfolio Resume - ${githubProfile.name || githubProfile.login}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #24292f;
            background: white;
            padding: 40px;
          }
          
          .header {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #0969da;
          }
          
          .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin-right: 30px;
            object-fit: cover;
          }
          
          .header-info h1 {
            font-size: 36px;
            margin-bottom: 8px;
            color: #24292f;
          }
          
          .header-info .username {
            font-size: 20px;
            color: #0969da;
            margin-bottom: 12px;
          }
          
          .header-info .bio {
            font-size: 16px;
            color: #656d76;
            max-width: 500px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
          
          .stat-card {
            text-align: center;
            padding: 20px;
            background: #f6f8fa;
            border-radius: 8px;
          }
          
          .stat-card .number {
            font-size: 24px;
            font-weight: bold;
            color: #0969da;
          }
          
          .stat-card .label {
            font-size: 14px;
            color: #656d76;
            margin-top: 4px;
          }
          
          .section {
            margin-bottom: 40px;
          }
          
          .section h2 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #24292f;
            border-bottom: 1px solid #d0d7de;
            padding-bottom: 8px;
          }
          
          .repo-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          
          .repo-card {
            border: 1px solid #d0d7de;
            border-radius: 8px;
            padding: 20px;
          }
          
          .repo-card h3 {
            font-size: 18px;
            color: #0969da;
            margin-bottom: 8px;
          }
          
          .repo-card .description {
            color: #656d76;
            margin-bottom: 12px;
            font-size: 14px;
          }
          
          .repo-meta {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 12px;
            color: #656d76;
          }
          
          .language-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 4px;
          }
          
          .skills-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          
          .skills-list {
            list-style: none;
          }
          
          .skills-list li {
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          .contribution-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          
          .contribution-item {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            background: #f6f8fa;
            border-radius: 6px;
          }
          
          @media print {
            body {
              padding: 20px;
            }
            
            .repo-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${githubProfile.avatarUrl}" alt="Profile Avatar" class="avatar" />
          <div class="header-info">
            <h1>${githubProfile.name || githubProfile.login}</h1>
            <div class="username">@${githubProfile.login}</div>
            ${githubProfile.bio ? `<div class="bio">${githubProfile.bio}</div>` : ''}
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="number">${githubProfile.repositories.totalCount}</div>
            <div class="label">Repositories</div>
          </div>
          <div class="stat-card">
            <div class="number">${githubProfile.followers.totalCount}</div>
            <div class="label">Followers</div>
          </div>
          <div class="stat-card">
            <div class="number">${githubProfile.following.totalCount}</div>
            <div class="label">Following</div>
          </div>
          <div class="stat-card">
            <div class="number">${contributionStats.totalCommitContributions}</div>
            <div class="label">Contributions</div>
          </div>
        </div>

        ${pinnedRepositories.length > 0 ? `
        <div class="section">
          <h2>Featured Projects</h2>
          <div class="repo-grid">
            ${pinnedRepositories.slice(0, 4).map(repo => `
              <div class="repo-card">
                <h3>${repo.repositoryName}</h3>
                <div class="description">Featured repository from ${repo.repositoryOwner}</div>
                <div class="repo-meta">
                  <span>⭐ Pinned Project</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="section">
          <h2>Top Repositories</h2>
          <div class="repo-grid">
            ${topRepositories.slice(0, 6).map(repo => `
              <div class="repo-card">
                <h3>${repo.name}</h3>
                <div class="description">${repo.description || 'No description available'}</div>
                <div class="repo-meta">
                  ${repo.primaryLanguage ? `
                    <span>
                      <span class="language-dot" style="background-color: ${repo.primaryLanguage.color || '#6b7280'}"></span>
                      ${repo.primaryLanguage.name}
                    </span>
                  ` : ''}
                  <span>⭐ ${repo.stargazerCount}</span>
                  <span>🍴 ${repo.forkCount}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <div class="skills-section">
            <div>
              <h2>Programming Languages</h2>
              <ul class="skills-list">
                ${Object.entries(languageStats).slice(0, 8).map(([lang, percentage]) => `
                  <li><strong>${lang}</strong> - ${percentage}% of code</li>
                `).join('')}
              </ul>
            </div>
            
            <div>
              <h2>Contribution Statistics</h2>
              <div class="contribution-stats">
                <div class="contribution-item">
                  <span>Commits</span>
                  <strong>${contributionStats.totalCommitContributions}</strong>
                </div>
                <div class="contribution-item">
                  <span>Pull Requests</span>
                  <strong>${contributionStats.totalPullRequestContributions}</strong>
                </div>
                <div class="contribution-item">
                  <span>Issues</span>
                  <strong>${contributionStats.totalIssueContributions}</strong>
                </div>
                <div class="contribution-item">
                  <span>Code Reviews</span>
                  <strong>${contributionStats.totalPullRequestReviewContributions}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async generateResumePDF(data: ResumeData): Promise<Buffer> {
    let browser;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });

      const page = await browser.newPage();
      const html = this.generateResumeHTML(data);
      
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF resume');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

export const pdfService = new PDFService();
