#!/bin/bash

# EU Jobs Brussels - Multi-Agent Development Script
# This script launches multiple Claude agents to work on different features in parallel

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🇪🇺 EU Jobs Brussels - Multi-Agent Development"
echo "================================================"
echo ""
echo "This script will launch multiple Claude agents to work on different features."
echo "Each agent will work in a separate terminal window."
echo ""

# Check if claude CLI is available
if ! command -v claude &> /dev/null; then
    echo "❌ Claude CLI not found. Please install it first."
    echo "   Run: npm install -g @anthropic-ai/claude-cli"
    exit 1
fi

# Feature prompts for each agent
AGENT1_PROMPT="You are working on EU Jobs Brussels project at $PROJECT_DIR. 
Your task: Implement the Prisma database schema and set up Supabase connection.
1. Create prisma/schema.prisma with all models (User, Company, Job, Category, Application, etc.)
2. Set up database connection in lib/db.ts
3. Create seed data script
Work independently and commit your changes."

AGENT2_PROMPT="You are working on EU Jobs Brussels project at $PROJECT_DIR.
Your task: Implement NextAuth.js authentication.
1. Install next-auth and configure providers (credentials, Google, LinkedIn)
2. Create auth API routes
3. Add session provider to layout
4. Protect dashboard routes
Work independently and commit your changes."

AGENT3_PROMPT="You are working on EU Jobs Brussels project at $PROJECT_DIR.
Your task: Implement the API routes for jobs.
1. Create /api/jobs route with GET (list/search) and POST (create)
2. Create /api/jobs/[id] route with GET, PUT, DELETE
3. Add pagination and filtering
4. Add proper error handling
Work independently and commit your changes."

AGENT4_PROMPT="You are working on EU Jobs Brussels project at $PROJECT_DIR.
Your task: Implement the employer dashboard.
1. Create /dashboard/employer layout and pages
2. Add job management (list, create, edit, delete)
3. Add applicant viewing
4. Add basic analytics
Work independently and commit your changes."

AGENT5_PROMPT="You are working on EU Jobs Brussels project at $PROJECT_DIR.
Your task: Implement SEO and sitemap.
1. Add JSON-LD structured data to all pages
2. Create dynamic sitemap.xml generation
3. Add robots.txt
4. Optimize meta tags
Work independently and commit your changes."

AGENT6_PROMPT="You are working on EU Jobs Brussels project at $PROJECT_DIR.
Your task: Implement job alerts and email notifications.
1. Create job alert subscription form
2. Set up email service (Resend or SendGrid)
3. Create email templates
4. Add cron job for sending alerts
Work independently and commit your changes."

# Function to launch agent in new terminal
launch_agent() {
    local agent_num=$1
    local prompt=$2
    local title="Agent $agent_num - EU Jobs Brussels"
    
    echo "🚀 Launching Agent $agent_num..."
    
    # For macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR' && claude --dangerously-skip-permissions '$prompt'\""
    # For Linux with gnome-terminal
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$title" -- bash -c "cd '$PROJECT_DIR' && claude --dangerously-skip-permissions '$prompt'; exec bash"
    # For Linux with xterm
    elif command -v xterm &> /dev/null; then
        xterm -title "$title" -e "cd '$PROJECT_DIR' && claude --dangerously-skip-permissions '$prompt'; bash" &
    else
        echo "❌ No supported terminal found for Agent $agent_num"
        return 1
    fi
}

# Menu
echo "Select which agents to launch:"
echo "1) All agents (6 parallel)"
echo "2) Database & Auth agents (2)"
echo "3) API & Dashboard agents (2)"
echo "4) SEO & Email agents (2)"
echo "5) Single agent (interactive)"
echo "6) Exit"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo "Launching all 6 agents..."
        launch_agent 1 "$AGENT1_PROMPT"
        sleep 2
        launch_agent 2 "$AGENT2_PROMPT"
        sleep 2
        launch_agent 3 "$AGENT3_PROMPT"
        sleep 2
        launch_agent 4 "$AGENT4_PROMPT"
        sleep 2
        launch_agent 5 "$AGENT5_PROMPT"
        sleep 2
        launch_agent 6 "$AGENT6_PROMPT"
        ;;
    2)
        echo "Launching Database & Auth agents..."
        launch_agent 1 "$AGENT1_PROMPT"
        sleep 2
        launch_agent 2 "$AGENT2_PROMPT"
        ;;
    3)
        echo "Launching API & Dashboard agents..."
        launch_agent 3 "$AGENT3_PROMPT"
        sleep 2
        launch_agent 4 "$AGENT4_PROMPT"
        ;;
    4)
        echo "Launching SEO & Email agents..."
        launch_agent 5 "$AGENT5_PROMPT"
        sleep 2
        launch_agent 6 "$AGENT6_PROMPT"
        ;;
    5)
        echo "Enter your custom prompt for the agent:"
        read -p "> " custom_prompt
        cd "$PROJECT_DIR" && claude --dangerously-skip-permissions "$custom_prompt"
        ;;
    6)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Agents launched! Check the terminal windows."
echo "📝 Each agent is working on a specific feature."
echo "🔄 They will commit their changes independently."
