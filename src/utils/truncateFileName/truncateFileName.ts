/**
 * Trims a filename to a specified maximum length while preserving the file extension.
 */
export default function truncateFileName(filename: string, maxLength = 20): string {
    const dotIndex = filename.lastIndexOf('.')

    // If there's no file extension or the dot is at the beginning (e.g., ".env"),
    // return the filename as is.
    if (dotIndex === -1 || dotIndex === 0) {
        return filename
    }

    const fileNameWithoutExtension = filename.substring(0, dotIndex)
    const fileExtension = filename.substring(dotIndex)

    // If the full filename is already within the max length, return as is.
    if (filename.length <= maxLength) {
        return filename
    }

    const ellipsis = '…'
    const remainingLength = maxLength - fileExtension.length - ellipsis.length

    // If the maximum allowed length is too short to fit both the ellipsis and the file extension,
    // there's no meaningful way to truncate the name so return the original filename unchanged.
    // Example: fileName = "report.pdf" and maxLength = 5,
    // the extension ".pdf" is already 4 characters, leaving no room for the base name
    // so we return "report.pdf" as is.
    if (remainingLength <= 0) {
        return filename
    }

    const preEllipses = Math.ceil(remainingLength / 2)
    const postEllipses = Math.floor(remainingLength / 2)

    // Truncate the file name and insert ellipsis
    const truncatedName = fileNameWithoutExtension.substring(0, preEllipses) + ellipsis + fileNameWithoutExtension.substring(fileNameWithoutExtension.length - postEllipses)
    return truncatedName + fileExtension
}
