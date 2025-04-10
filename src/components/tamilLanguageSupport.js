// Tamil language support research for AI StoryLand app
// This file contains research findings and implementation strategies

/**
 * TAMIL LANGUAGE SUPPORT RESEARCH
 * 
 * 1. Text-to-Speech Options for Tamil
 * 
 * a) ElevenLabs API
 *    - Pros: High-quality voices, good Tamil support, voice customization
 *    - Cons: Requires API key, usage limits, paid service
 *    - Implementation: Can be integrated via REST API
 * 
 * b) Google Cloud Text-to-Speech
 *    - Pros: Good Tamil support, reliable service
 *    - Cons: Requires API key, paid service
 *    - Implementation: Can be integrated via REST API
 * 
 * c) Web Speech API with Tamil voices
 *    - Pros: Free, built into browsers, no external dependencies
 *    - Cons: Limited Tamil voice options, quality varies by browser
 *    - Implementation: Check for Tamil voices using speechSynthesis.getVoices()
 *    - Example code:
 *      const tamilVoices = window.speechSynthesis.getVoices().filter(
 *        voice => voice.lang === 'ta-IN' || voice.lang === 'ta'
 *      );
 * 
 * 2. Story Translation Approaches
 * 
 * a) Pre-translated story templates
 *    - Pros: Reliable, works offline, consistent quality
 *    - Cons: Limited to predefined stories, less dynamic
 *    - Implementation: Create parallel story objects in Tamil
 * 
 * b) Real-time translation API
 *    - Pros: Works with any dynamic content, more flexible
 *    - Cons: Requires API key, potential quality issues, network dependency
 *    - Implementation options:
 *      - Google Translate API
 *      - Microsoft Translator API
 *      - DeepL API (limited Tamil support)
 * 
 * 3. UI Considerations for Tamil
 * 
 * a) Font support
 *    - Ensure proper Tamil font rendering with appropriate font families
 *    - Recommended fonts: Latha, Nirmala UI, Bamini, Tamil MN
 * 
 * b) Text direction and layout
 *    - Tamil is left-to-right like English, so no special layout changes needed
 * 
 * c) Text length considerations
 *    - Tamil text may be longer than equivalent English text
 *    - Ensure UI components can handle variable text length
 * 
 * 4. Implementation Strategy
 * 
 * a) Language state management
 *    - Store current language in React state
 *    - Persist language preference in localStorage
 * 
 * b) Content delivery based on language
 *    - Create a language context provider
 *    - Implement content switching based on selected language
 * 
 * c) Fallback mechanisms
 *    - Default to English if Tamil resources unavailable
 *    - Provide clear error messages if Tamil TTS fails
 */

// Sample Tamil story templates
const tamilStoryTemplates = {
  lion: {
    title: "தைரியமான சிங்கம் லியோ",
    intro: "ஒரு காலத்தில், லியோ என்ற தைரியமான சிங்கம் இருந்தது. லியோவுக்கு அழகான தங்க நிற குடுமியும் வலிமையான கர்ஜனையும் இருந்தது.",
    middle_segments: [
      "லியோ சவானாவில் தனது அனைத்து விலங்கு நண்பர்களுடன் வாழ்ந்து வந்தது.",
      "ஒரு நாள், லியோ உதவிக்கான அழைப்பைக் கேட்டது. அது நதியிலிருந்து வந்தது!",
      "லியோ என்ன நடக்கிறது என்பதைப் பார்க்க முடிந்தவரை வேகமாக ஓடியது.",
      "நதியில், லியோ நீந்த முடியாத மற்றும் தண்ணீரைக் கண்டு பயந்த ஒரு சிறிய முயலைக் கண்டது.",
      "லியோ மிகவும் தைரியமானது. அது கவனமாக முயல் நதியைக் கடக்க உதவியது."
    ],
    endings: [
      "முயல் லியோவுக்கு இவ்வளவு தைரியமாகவும் உதவியாகவும் இருந்ததற்கு நன்றி தெரிவித்தது.",
      "லியோவும் முயலும் நல்ல நண்பர்களாகி ஒவ்வொரு நாளும் ஒன்றாக விளையாடினர்.",
      "மேலும் லியோ, தைரியம் என்பது மற்றவர்கள் பயப்படும்போது அவர்களுக்கு உதவுவது என்று கற்றுக்கொண்டது."
    ],
    sound_effects: ["lion_roar", "savanna_ambience", "river_flowing"],
    primary_animal: "lion",
    animal_name: "லியோ"
  },
  elephant: {
    title: "எல்லியின் பெரிய நாள்",
    intro: "எல்லி என்பது பெரிய தொங்கும் காதுகள் மற்றும் மிக நீளமான துதிக்கை கொண்ட ஒரு இளம் யானை. அது தனது குடும்பத்துடன் காட்டில் வாழ்ந்தது.",
    middle_segments: [
      "எல்லி தனது துதிக்கையைப் பயன்படுத்தி தண்ணீரைத் தெளிப்பதையும் பொருட்களை எடுப்பதையும் விரும்பினாள்.",
      "ஒரு நாள், எல்லியும் அவளது குடும்பமும் நீர்த்தேக்கத்திற்கு நடக்கச் சென்றனர்.",
      "நீர்த்தேக்கத்தில், எல்லி முதல் முறையாக தண்ணீரில் தனது பிரதிபலிப்பைப் பார்த்தாள்.",
      "அவளது காதுகள் எவ்வளவு பெரியதாக இருந்தன என்பதைக் கண்டு அவள் ஆச்சரியப்பட்டாள்!",
      "எல்லியின் காதுகள் அவளது நண்பர்களின் காதுகளை விட பெரியதாக இருந்ததால் அவள் சற்று வருத்தமாக உணர்ந்தாள்."
    ],
    endings: [
      "எல்லியின் தாய் அவளிடம் அவளது பெரிய காதுகள் சிறப்பானவை என்றும் வெப்பமான சூரியனில் குளிர்ச்சியாக இருக்க உதவும் என்றும் கூறினார்.",
      "எல்லி ஒவ்வொருவரும் வித்தியாசமானவர்கள் என்பதையும், அதுதான் ஒவ்வொரு விலங்கையும் சிறப்பாக்குகிறது என்பதையும் உணர்ந்தாள்.",
      "அன்றிலிருந்து, எல்லி தனது பெரிய காதுகளை நேசித்தாள் மற்றும் தன்னைப் பற்றி பெருமைப்பட்டாள்."
    ],
    sound_effects: ["elephant_trumpet", "jungle_ambience", "water_splash"],
    primary_animal: "elephant",
    animal_name: "எல்லி"
  },
  tiger: {
    title: "கோடுகளுடன் கூடிய டைலர் புலி",
    intro: "டைலர் என்பது அழகான ஆரஞ்சு நிற மயிர் மற்றும் கருப்பு கோடுகளைக் கொண்ட ஒரு இளம் புலி. அது உயரமான மரங்கள் மற்றும் வண்ணமயமான பூக்கள் நிறைந்த அடர்ந்த காட்டில் வாழ்ந்தது.",
    middle_segments: [
      "டைலர் மரங்களுக்கு இடையே ஓடி கண்ணாமூச்சி விளையாடுவதை விரும்பினான்.",
      "அவனது கோடுகள் உயரமான புல்லிலும் மரங்களுக்கு இடையிலும் மறைவதற்கு மிகவும் நல்லதாக இருந்தன.",
      "ஒரு மழை நாளில், டைலரால் விளையாட வெளியே செல்ல முடியவில்லை.",
      "அவன் சலிப்பாகவும் சற்று வருத்தமாகவும் உணர்ந்தான்.",
      "பின்னர் அவனுக்கு ஒரு யோசனை வந்தது! அவன் தனது புலிக் குடும்பத்துடன் உள்ளே விளையாட்டுகளை விளையாடலாம்."
    ],
    endings: [
      "டைலரும் அவனது குடும்பமும் நாள் முழுவதும் வேடிக்கையான விளையாட்டுகளை விளையாடினர்.",
      "அவர்கள் கதைகளைச் சொன்னார்கள், நடனங்களை உருவாக்கினார்கள், மேலும் இலைகளுடன் ஒரு வசதியான குகையையும் கட்டினார்கள்.",
      "டைலர் எங்கிருந்தாலும், வீட்டில் மழை நாட்களிலும் கூட வேடிக்கையாக இருக்கலாம் என்று கற்றுக்கொண்டான்."
    ],
    sound_effects: ["tiger_growl", "rain_sounds", "jungle_ambience"],
    primary_animal: "tiger",
    animal_name: "டைலர்"
  },
  default: {
    title: "விலங்கு சாகசம்",
    intro: "ஒரு காலத்தில், அழகான இடத்தில் வாழ்ந்த ஒரு அற்புதமான விலங்கு இருந்தது.",
    middle_segments: [
      "இந்த விலங்குக்கு அருகில் வசிக்கும் பல நண்பர்கள் இருந்தனர்.",
      "ஒரு சூரிய காலை, விலங்கு ஒரு சாகசத்திற்குச் செல்ல முடிவு செய்தது.",
      "வழியில், விலங்கு புதிய நண்பர்களைச் சந்தித்து அற்புதமான விஷயங்களைப் பார்த்தது.",
      "எங்கும் உயரமான மரங்கள், பாயும் நதிகள் மற்றும் வண்ணமயமான பூக்கள் இருந்தன.",
      "விலங்கும் நண்பர்களும் விளையாட்டுகளை விளையாடி அற்புதமான நேரத்தைக் கழித்தனர்."
    ],
    endings: [
      "சூரியன் மறையத் தொடங்கியதும், விலங்கு வீட்டிற்குத் திரும்பியது.",
      "அது வேடிக்கை மற்றும் சாகசம் நிறைந்த ஒரு சரியான நாளாக இருந்தது.",
      "அந்த விலங்கு அன்று இரவு அடுத்த சாகசத்தைப் பற்றி கனவு கண்டபடி தூங்கியது."
    ],
    sound_effects: ["nature_sounds", "happy_music"],
    primary_animal: "animal",
    animal_name: "ஃபஸி"
  }
};

// Export for use in the application
export default tamilStoryTemplates;
