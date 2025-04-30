## V 0.5.4
 - Added some error checking to the get func
## V 0.5.3
 - Fixed a bug that was causing `merger.js` to delete HTML elements
## V 0.5.2
 - Changed `Copyright [2024] [R33S3Y]` to `Copyright 2024 R33S3Y` in line 190 of licence
## V 0.5.1
 - Changed the rating item to ratings
 - Changed the totalReviews to totalRatings
 - Added search to fetcherTemplate
# V 0.5
 - Added mangasearch.search() ([Documentation here](API.md##Search))
 - Readme changes
 - Fixed a issue with page overflows in mangatoto.search()
 - Changed parallelizeUpdateRequests to use promise.allSettled instead of promise.all
 - Fixed issue with error handling in distributeSearchRequest and distributeUpdateRequest
# V 0.4
 - Added the updateConfig function ([Documentation here](API.md##UpdateConfig)) to replace customizable defaults added in V0.1.4
 - Added a function to all classes called updateConfig()
 - Added orderRequests() to RequestHandler
 - Added Documention for the new changes
 - Renamed functions in RequestHandler
## V 0.3.4
 - Removed the file mangaScraperBackend.js via storing RequestHandler in mangascraper.js directly
 - Updated fetcherTemplate.js to better reflect how devs should a sites
 - Updated documentation to reflect change
 - Minor readme change
## V 0.3.3
 - Added the functionalty to mangatoto.search() for testing and building up the rest of the search API
 - Changed mangatoto to use Fetcher.site() to requset websites
 - Fixed error with logging in mangatoto that made it look like the was data loss happening
 - Fixed errors in documention
## V 0.3.2
 - Added info about features that were added in 0.3.1 but I forgot to include in documetion for.
 - Added alwaysOutput & justChapter flags to get
## V 0.3.1
 - Added the fallbackLanguage flag to the get function. See:
 - Added the fallbackLanguage, alwaysOutput & justChapter flags to the getItems function in InfoSourceHelper
 - Added large amounts of in code documentation for the support functions.
 - Did the documentation in the [Support functions](Support%20functions.md) document
# V 0.3
 - Changed language to align with ISO 639-3
 - Added the languagefinder.js to support
 - Added the fetcher.js to support
# V 0.2
 - Added Documentation for previous content
## V 0.1.5
 - Added the template function ([Documentation here](API.md##Template))
 - Added null to the list of defaults in the merge function
 - Fixed error on the line 28 in the makeBaseTemplate function added in 0.1.4 (0.1.4-dev3 to be more exact)
 - Increased input checking/error handling on backend/support functions
## V 0.1.4
 - Change Log Added
 - Added customizable defaults ([Documentation here](API.md##Config%20/%20Customizable%20defaults))
 - Changed Langauge to Language