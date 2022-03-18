export const LINK_TAGS = {
  YouTube:
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
  GitHub: /https:\/\/github\.com(?:\/[^\s/]+)/,
  GoogleDrive: /^https?:\/\/drive\.google\.com/,
  GoogleDocs: /^https?:\/\/docs\.google\.com\/document/,
  GoogleSheets: /^https?:\/\/docs\.google\.com\/spreadsheets/,
  GoogleSlides: /^https?:\/\/docs\.google\.com\/presentation/,
  Jira: /^https?:\/\/((\*|[\w\d]+(-[\w\d]+)*)\.)*(atlassian)(\.net)/,
  Twitter: /^https?:\/\/(www\.)?(twitter|t)\.(com|co)/,
  Slack: /^https?:\/\/app\.slack\.com/
}

export const getSystemTagsFromLinks = (links: string[]) => {
  const sysTags = new Set<string>()

  links.forEach((link) => {
    Object.entries(LINK_TAGS).forEach(([tagName, regex]) => {
      if (link.match(regex)) sysTags.add(`MEX_${tagName}`)
    })
  })

  return [...sysTags]
}
