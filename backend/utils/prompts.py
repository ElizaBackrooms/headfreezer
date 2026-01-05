"""
Prompts for 241543903 Heads in Freezers meme generation.
"""

def get_fridge_meme_prompt(custom_prompt: str = "") -> str:
    """
    Returns the prompt for generating the 241543903 Heads in Freezers meme.
    """
    
    base_prompt = """Transform this image into the viral "241543903" meme (Heads in Freezers meme).

The person in the image should appear to be sticking their head inside a refrigerator/freezer, surrounded by frozen food items, ice, and frost. 

Create a realistic composite that looks like they're actually inside a freezer with their head among frozen vegetables, ice cream, and other frozen goods. 

Make it humorous and true to the original meme aesthetic. Ensure the lighting and perspective match a typical refrigerator interior view.

CRITICAL REQUIREMENTS:
1. Person's head should be inside a refrigerator/freezer
2. Surround with frozen food: ice cream containers, frozen vegetables (peas, corn, etc.), ice cubes
3. Add frost and ice effects
4. Cool white/blue lighting typical of refrigerator interiors
5. Realistic composite - should look like they're actually in the freezer
6. Maintain recognizable features from the original person
7. Humorous and meme-worthy aesthetic
8. High quality, photorealistic result"""

    if custom_prompt:
        base_prompt += f"\n\nADDITIONAL INSTRUCTIONS: {custom_prompt}"

    return base_prompt

