 let currentPage = 1;
        
        // Sound Effects using Web Audio API
        class SoundEffects {
            constructor() {
                this.audioContext = null;
                this.initAudio();
            }
            
            initAudio() {
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    console.log('Web Audio API not supported');
                }
            }
            
            // Button click sound - pleasant UI sound
            playButtonClick() {
                if (!this.audioContext) return;
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
                
                oscillator.type = 'sine';
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }
            
            // Typing sound - subtle click
            playTyping() {
                if (!this.audioContext) return;
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
                
                oscillator.type = 'square';
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.05);
            }
            
            // Success sound for recipe found
            playSuccess() {
                if (!this.audioContext) return;
                
                const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord
                
                frequencies.forEach((freq, index) => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    
                    const startTime = this.audioContext.currentTime + (index * 0.1);
                    gainNode.gain.setValueAtTime(0, startTime);
                    gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
                    
                    oscillator.type = 'sine';
                    oscillator.start(startTime);
                    oscillator.stop(startTime + 0.3);
                });
            }
            
            // Cooking sound - bubbling effect
            playCooking() {
                if (!this.audioContext) return;
                
                // Create multiple oscillators for bubbling effect
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        const oscillator = this.audioContext.createOscillator();
                        const gainNode = this.audioContext.createGain();
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(this.audioContext.destination);
                        
                        oscillator.frequency.setValueAtTime(200 + Math.random() * 100, this.audioContext.currentTime);
                        
                        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                        gainNode.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 0.1);
                        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
                        
                        oscillator.type = 'sawtooth';
                        oscillator.start(this.audioContext.currentTime);
                        oscillator.stop(this.audioContext.currentTime + 0.4);
                    }, i * 600);
                }
            }
        }
        
        const soundEffects = new SoundEffects();
        
        // OpenAI API Configuration
       
        
        // Expanded recipe database
        const recipes = [
            {
                name: "Scrambled Eggs",
                ingredients: ["eggs", "butter", "salt", "pepper"],
                instructions: [
                    "Crack and beat the eggs in a bowl. Crack the 2 eggs beat them gently with a fork or whisk until well mixed",
                    "Place a non-stick pan on low to medium heat",
                    "Add 1 tbsp butter and let it melt fully",
                    "Pour the beaten eggs into the pan",
                    "Let them sit for a few seconds without stirring",
                    "Using a spatula, slowly stir the eggs from the edges to the center",
                    "When the eggs are just set (still a little soft), remove the pan from heat",
                    "Sprinkle a pinch of salt and pepper to taste",
                    "Plate and enjoy!"
                ]
            },
            {
                name: "Tomato Pasta",
                ingredients: ["pasta", "tomato", "olive oil", "garlic", "salt"],
                instructions: [
                    "Boil water in a large pot and cook pasta according to package instructions",
                    "Heat olive oil in a pan over medium heat",
                    "Add minced garlic and sauté for 1 minute",
                    "Add diced tomatoes and cook for 5-7 minutes",
                    "Season with salt and pepper",
                    "Drain pasta and mix with tomato sauce",
                    "Serve hot"
                ]
            },
            {
                name: "Butter Toast",
                ingredients: ["bread", "butter"],
                instructions: [
                    "Toast bread slices until golden brown",
                    "Spread butter evenly on warm toast",
                    "Serve immediately while warm"
                ]
            },
            {
                name: "Garlic Bread",
                ingredients: ["bread", "butter", "garlic", "salt"],
                instructions: [
                    "Preheat oven to 375°F (190°C)",
                    "Mix softened butter with minced garlic and salt",
                    "Spread garlic butter on bread slices",
                    "Bake for 10-12 minutes until golden",
                    "Serve warm"
                ]
            },
            {
                name: "Simple Salad",
                ingredients: ["lettuce", "tomato", "olive oil", "salt"],
                instructions: [
                    "Wash and chop lettuce into bite-sized pieces",
                    "Dice tomatoes",
                    "Mix lettuce and tomatoes in a bowl",
                    "Drizzle with olive oil and sprinkle salt",
                    "Toss well and serve fresh"
                ]
            },
            {
                name: "Egg Sandwich",
                ingredients: ["bread", "eggs", "butter", "salt"],
                instructions: [
                    "Scramble eggs with butter and salt",
                    "Toast bread slices",
                    "Place scrambled eggs between toast",
                    "Cut in half and serve"
                ]
            },
            {
                name: "Pasta with Garlic Oil",
                ingredients: ["pasta", "olive oil", "garlic", "salt", "pepper"],
                instructions: [
                    "Cook pasta in salted water until al dente",
                    "Heat olive oil in a large pan",
                    "Add sliced garlic and cook until fragrant",
                    "Add drained pasta to the pan",
                    "Toss with garlic oil, salt, and pepper",
                    "Serve immediately"
                ]
            },
            {
                name: "Tomato Salad",
                ingredients: ["tomato", "olive oil", "salt", "pepper"],
                instructions: [
                    "Slice tomatoes into rounds",
                    "Arrange on a plate",
                    "Drizzle with olive oil",
                    "Season with salt and pepper",
                    "Let sit for 5 minutes before serving"
                ]
            }
        ];
        
        function nextPage() {
            soundEffects.playButtonClick();
            document.getElementById('page1').classList.remove('active');
            document.getElementById('page2').classList.add('active');
            currentPage = 2;
        }
        
        function startCooking() {
            const ingredients = document.getElementById('ingredientsInput').value.trim();
            if (!ingredients) {
                alert('Please enter some ingredients!');
                return;
            }
            
            soundEffects.playButtonClick();
            document.getElementById('displayIngredients').textContent = ingredients;
            document.getElementById('page2').classList.remove('active');
            document.getElementById('page3').classList.add('active');
            currentPage = 3;
            
            // Play cooking sound
            soundEffects.playCooking();
            
            // Generate recipe with AI (with fallback to local recipes)
            const userIngredients = ingredients.split(',').map(ing => ing.trim().toLowerCase());
            generateRecipeWithAI(userIngredients)
                .then(aiRecipe => {
                    // AI recipe generated successfully
                    setTimeout(() => {
                        showAIRecipe(aiRecipe);
                    }, 3000);
                })
                .catch(error => {
                    console.log('AI generation failed, falling back to local recipes:', error);
                    // Fallback to local recipe matching
                    setTimeout(() => {
                        showRecipes(ingredients);
                    }, 3000);
                });
        }
        
        function showRecipes(ingredientsText) {
            const userIngredients = ingredientsText.split(',').map(ing => ing.trim().toLowerCase());
            const matchedRecipes = findRecipes(userIngredients);
            
            document.getElementById('page3').classList.remove('active');
            document.getElementById('page4').classList.add('active');
            currentPage = 4;
            
            // Play success sound when recipes are found
            if (matchedRecipes.length > 0) {
                soundEffects.playSuccess();
            }
            
            const resultsContainer = document.getElementById('recipeResults');
            
            if (matchedRecipes.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="no-recipes">
                        <p>No recipes found with your ingredients. Try adding more common ingredients like eggs, bread, butter, or pasta!</p>
                    </div>
                `;
            } else {
                let htmlContent = `<div class="input-label">HERE IS YOUR RECIPE:</div>`;
                
                matchedRecipes.forEach(recipe => {
                    htmlContent += `
                        <div class="recipe-card">
                            <div class="recipe-title">${recipe.name.toUpperCase()}</div>
                            
                            <div class="recipe-section">
                                <h4>Ingredients:</h4>
                                <ul>
                                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                                </ul>
                            </div>
                            
                            ${recipe.missing_ingredients.length > 0 ? `
                                <div class="missing-ingredients">
                                    <h4>Missing Ingredients:</h4>
                                    <p>${recipe.missing_ingredients.join(', ')}</p>
                                </div>
                            ` : ''}
                            
                            <div class="recipe-section">
                                <h4>Instructions:</h4>
                                <ul>
                                    ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                });
                
                resultsContainer.innerHTML = htmlContent;
            }
        }
        
        function findRecipes(userIngredients) {
            const userSet = new Set(userIngredients);
            const matched = [];
            
            recipes.forEach(recipe => {
                const recipeSet = new Set(recipe.ingredients.map(ing => ing.toLowerCase()));
                const common = new Set([...userSet].filter(x => recipeSet.has(x)));
                const matchRatio = common.size / recipeSet.size;
                
                if (matchRatio >= 0.5) { // At least 50% of ingredients match
                    const missing = [...recipeSet].filter(x => !userSet.has(x));
                    matched.push({
                        name: recipe.name,
                        ingredients: recipe.ingredients,
                        missing_ingredients: missing,
                        instructions: recipe.instructions,
                        missingCount: missing.length
                    });
                }
            });
            
            // Sort by least missing ingredients first
            matched.sort((a, b) => a.missingCount - b.missingCount);
            
            return matched;
        }
        
        function goToIngredients() {
            soundEffects.playButtonClick();
            document.getElementById('page4').classList.remove('active');
            document.getElementById('page2').classList.add('active');
            currentPage = 2;
            document.getElementById('ingredientsInput').value = '';
        }
        
        // Add typing sound effect to textarea
        document.addEventListener('DOMContentLoaded', function() {
            const textarea = document.getElementById('ingredientsInput');
            let lastTypingTime = 0;
            
            textarea.addEventListener('input', function() {
                const currentTime = Date.now();
                // Throttle typing sounds to avoid too many sounds
                if (currentTime - lastTypingTime > 100) {
                    soundEffects.playTyping();
                    lastTypingTime = currentTime;
                }
            });
            
            // Enable audio context on first user interaction
            document.addEventListener('click', function() {
                if (soundEffects.audioContext && soundEffects.audioContext.state === 'suspended') {
                    soundEffects.audioContext.resume();
                }
            }, { once: true });
        });