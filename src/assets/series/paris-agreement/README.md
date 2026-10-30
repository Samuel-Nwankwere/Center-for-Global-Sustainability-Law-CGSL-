# The Paris Agreement Series — issue files

Put each issue here as `issue-1.pdf`, `issue-2.pdf`, … (lowercase; the number is the issue number).
The series introduction, if there is one, goes here as `intro.pdf`; it is shown first, labelled "Introduction".
Then run `npm run series:covers` to create a `.webp` cover from each PDF's first page,
and add the issue's title to `issueTitles` in `src/content/series.ts`.
