#!/bin/bash
set -e

# Colors for terminal styling
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== CustOS ERP QA Automation Test Suite Runner ===${NC}"

# 1. Check if PostgreSQL & Redis dependencies are up
echo -e "${YELLOW}Checking targets...${NC}"
PORT_API=3000
PORT_WEB=5173

# If we are targeting the remote staging, bypass local port check
if [ "$BASE_URL" = "https://app.custos.pymesenlinea.com.ar" ] || [ -z "$BASE_URL" ]; then
  echo -e "${GREEN}Targeting remote server: https://app.custos.pymesenlinea.com.ar. Skipping local dev servers boot.${NC}"
  API_RUNNING=true
  WEB_RUNNING=true
else
  API_RUNNING=true
  WEB_RUNNING=true

  if ! lsof -i :$PORT_API > /dev/null; then
    API_RUNNING=false
  fi

  if ! lsof -i :$PORT_WEB > /dev/null; then
    WEB_RUNNING=false
  fi
fi

# 2. Boot up servers in the background if they aren't already running
API_PID=""
WEB_PID=""

if [ "$API_RUNNING" = false ] || [ "$WEB_RUNNING" = false ]; then
  echo -e "${YELLOW}Dev services are offline. Booting up monorepo dev stack...${NC}"
  
  # Ensure database migrations are up to date and sample seeds are loaded
  echo -e "${YELLOW}Running DB migrations and seeds...${NC}"
  cd ../apps/api
  npx prisma migrate deploy
  npx prisma db seed
  cd ../../qa

  # Start monorepo dev server (which runs api + web)
  echo -e "${YELLOW}Starting dev servers...${NC}"
  npm run dev --prefix .. > /tmp/dev_monorepo.log 2>&1 &
  MONOREPO_PID=$!
  
  # Wait for API and Web to respond
  echo -e "${YELLOW}Waiting for services to become healthy...${NC}"
  for i in {1..30}; do
    if lsof -i :$PORT_API > /dev/null && lsof -i :$PORT_WEB > /dev/null; then
      echo -e "${GREEN}Services are online and healthy!${NC}"
      break
    fi
    sleep 2
    if [ $i -eq 30 ]; then
      echo -e "${RED}Error: Dev servers failed to start. View log at /tmp/dev_monorepo.log${NC}"
      exit 1
    fi
  done
else
  echo -e "${GREEN}Target environment is active. Proceeding. ${NC}"
fi

# 3. Create reports directories
mkdir -p reports/screenshots
mkdir -p reports/videos

# 4. Trigger Playwright Tests
echo -e "${BLUE}Running Playwright E2E and Functional tests...${NC}"
NPX_PLAYWRIGHT="npx playwright test"

set +e # allow tests to fail so we can collect reports
$NPX_PLAYWRIGHT tests/e2e.spec.ts --reporter=list,html
E2E_STATUS=$?

echo -e "${BLUE}Running API Integration tests...${NC}"
$NPX_PLAYWRIGHT tests/api.spec.ts --reporter=list,html
API_STATUS=$?

echo -e "${BLUE}Running Accessibility & Visual snapshot tests...${NC}"
$NPX_PLAYWRIGHT tests/a11y-visual.spec.ts --reporter=list,html
A11Y_STATUS=$?

echo -e "${BLUE}Running Resilience fault-injection tests...${NC}"
$NPX_PLAYWRIGHT tests/resilience.spec.ts --reporter=list,html
RESILIENCE_STATUS=$?

# 5. Trigger k6 Load/Stress test if k6 is installed
echo -e "${BLUE}Checking if k6 load testing utility is available...${NC}"
if command -v k6 &> /dev/null; then
  echo -e "${GREEN}k6 is available. Loading stress tests...${NC}"
  k6 run load/stress.js
  K6_STATUS=$?
else
  echo -e "${YELLOW}k6 is not found. Skipping load/stress test run.${NC}"
  K6_STATUS=0
fi
set -e

# 6. Tear down background servers if we started them
if [ -n "$MONOREPO_PID" ]; then
  echo -e "${YELLOW}Stopping background monorepo servers...${NC}"
  kill $MONOREPO_PID || true
fi

echo -e "${BLUE}=== QA Test Runs Summary ===${NC}"
if [ $E2E_STATUS -eq 0 ] && [ $API_STATUS -eq 0 ] && [ $A11Y_STATUS -eq 0 ] && [ $RESILIENCE_STATUS -eq 0 ] && [ $K6_STATUS -eq 0 ]; then
  echo -e "${GREEN}SUCCESS: All QA test suites completed without errors!${NC}"
  exit 0
else
  echo -e "${RED}FAILURE: Some test suites encountered failures.${NC}"
  echo -e "E2E Epectation status: $E2E_STATUS"
  echo -e "API Integration status: $API_STATUS"
  echo -e "Accessibility/Visual status: $A11Y_STATUS"
  echo -e "Resilience status: $RESILIENCE_STATUS"
  echo -e "k6 Load status: $K6_STATUS"
  exit 1
fi
