REM ---------------
REM React production builder
REM ---------------

REM Delete current build
rmdir /s /q build 2>nul

REM Make warnings stop the build
set CI=true
REM Don't generate sourcemaps
set GENERATE_SOURCEMAP=false

REM Run the production build
npm run build