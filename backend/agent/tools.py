from langchain_community.tools import DuckDuckGoSearchRun

search_tool = DuckDuckGoSearchRun()

tools = [
    {
        "name": "Web Search",
        "func": search_tool.run,
        "description": "Search the internet for current information."
    }
]
