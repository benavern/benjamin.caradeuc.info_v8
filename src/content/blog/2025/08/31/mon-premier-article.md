---
title: "Mon premier article"
date: 2025-08-31
tags: ["astro", "lit", "perso"]
---

Ceci est le contenu de **mon premier article** écrit en Markdown 🎉.


```astro
<div class="grid grid--gap">
    <div class="grid__col grid__col-6">
        <label>
            <input
                type="text"
                placeholder="Benjamin CARADEUC"
                value={name()}
                onInput={e => setName(e.currentTarget.value)}
                required />

            <div class="label label--floating">
                Votre nom
            </div>
        </label>
    </div>
</div>
```

![ma tronche](/images/avatar.png)
