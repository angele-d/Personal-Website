#!/bin/bash

# Lancement: bash tests/run_tests.sh

# tests/run_tests.sh
# Script pour exécuter tous les tests du projet

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
VIOLET='\033[0;35m' # Violet/Magenta
NC='\033[0m' # No Color

echo -e "${VIOLET}========================================${NC}"
echo -e "${VIOLET}  SUITE DE TESTS - Personal Website${NC}"
echo -e "${VIOLET}========================================${NC}"

# Aller au répertoire racine du projet
cd "$(dirname "$0")/.."

# Test 1: db.test.js
echo -e "\n${VIOLET}📋 Exécution: db.test.js${NC}"
echo "---"
node tests/db.test.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ db.test.js réussi${NC}"
else
    echo -e "${RED}❌ db.test.js échoué${NC}"
    exit 1
fi

# Test 2: verification.test.js
echo -e "\n${VIOLET}📋 Exécution: verification.test.js${NC}"
echo "---"
node tests/verification.test.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ verification.test.js réussi${NC}"
else
    echo -e "${RED}❌ verification.test.js échoué${NC}"
    exit 1
fi

# Résumé final
echo -e "\n${VIOLET}========================================${NC}"
echo -e "${GREEN}✅ TOUS LES TESTS SONT PASSÉS!${NC}"
echo -e "${VIOLET}========================================${NC}"
echo -e "${GREEN}Le projet est prêt pour le push! 🚀${NC}\n"

exit 0
