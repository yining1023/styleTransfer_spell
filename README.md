# styleTransfer_spell
Style Transfer example with [ml5.js](http://ml5js.org/), training the model with [Spell.run](https://learn.spell.run/)

#### Demo: [https://yining1023.github.io/styleTransfer_spell/](https://yining1023.github.io/styleTransfer_spell/.)

Here are some [slides](https://bit.ly/2xB9t8K) that introduce what is style transfer and how does it work.

## Training a style transfer model with Spell!

Check out [Transferring Style Tutorial from Spell](https://learn.spell.run/transferring_style) for more info about steps 1 - 3.
1. Preparing your environment
2. Downloading Datasets
3. Training with style.py
4. Converting model to ml5js (Read more at [reiinakano](https://github.com/reiinakano)'s [fast-style-transfer-deeplearnjs](https://github.com/reiinakano/fast-style-transfer-deeplearnjs#adding-your-own-styles))

## Credits
I used the [TensorFlow implementation of fast style tranfer](https://github.com/lengstrom/fast-style-transfer) developed by [Logan Engstrom](https://github.com/lengstrom). And the [fast-style-transfer-deeplearnjs](https://github.com/reiinakano/fast-style-transfer-deeplearnjs) by [Reiichiro Nakano](https://github.com/reiinakano) to convert the tensforflow model to a tf.js model that can used in ml5.js

### 0. Setup Spell.run
Sign up on Spell.run, login

You can skip the following two steps if you have pip installed already.
```
$ curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py`
$ python get-pip.py

```
Install spell, and log into spell
```
$ pip install spell
$ spell
$ spell login

```

### 1. Preparing your environment
Clone [the fast-style-transfer git repo from github](https://github.com/lengstrom/fast-style-transfer).
```
$ git clone https://github.com/lengstrom/fast-style-transfer
$ cd fast-style-transfer

```

Create some folders and files
```
$ mkdir ckpt/
$ touch ckpt/.gitignore
$ mkdir images
$ mkdir images/style

```

Put a "style" image into the images/style directory. There needs to be at least one image in this folder.

Add the changes and commit it to git.
```
$ git add images ckpt
$ git commit -m "Added required folders and images"

```

### 2. Downloading Datasets
```
$ spell run --machine-type CPU ./setup.sh
```
It took me 1.5 hours to finish this run. The dataset is large, it takes time to save to Spell.

### 3. Training with style.py
```
spell run --mount runs/THE_RUN_NUMBER_OF_YOUR_SETUP_RUN/data:datasets \
            --machine-type V100 \
            --framework tensorflow \
            --apt ffmpeg \
            --pip moviepy \
  "python style.py \
  --checkpoint-dir ckpt \
  --style images/style/YOUR_STYLE_IMAGE_NAME.jpg \
  --style-weight 1.5e2 \
  --train-path datasets/train2014 \
  --vgg-path datasets/imagenet-vgg-verydeep-19.mat"
  
```
Remember to replace the `THE_RUN_NUMBER_OF_YOUR_SETUP_RUN` and `YOUR_STYLE_IMAGE_NAME`.
I used V100 machine. This run took me ~2 hours. And it created files in the `ckpt` folder.

To list and download these resulting checkpoint files use the `spell ls` and `spell cp` commands.
You can go to any directory that you want to save the files in and run -
```
spell ls runs/YOUR_RUN_NUMBER
spell ls runs/YOUR_RUN_NUMBER/ckpt
spell cp runs/YOUR_RUN_NUMBER/ckpt

```
Remember to replace YOUR_RUN_NUMBER.

### 4. Converting model to ml5js
Go to a new directory,
```
git clone https://github.com/reiinakano/fast-style-transfer-deeplearnjs.git
cd fast-style-transfer-deeplearnjs
```

Put the checkpoint files we downloaded from spell into the current directory,
```
python scripts/dump_checkpoint_vars.py --output_dir=src/ckpts/YOUR_FOLDER_NAME --checkpoint_file=./YOUR_FOLDER_NAME/fns.ckpt

python scripts/remove_optimizer_variables.py --output_dir=src/ckpts/YOUR_FOLDER_NAME

```
Remember to replace `YOUR_FOLDER_NAME`, the folder that holds all the checkpoint files.
It will create a new folder in `src/ckpts` with 49 items including a manifest.json file.

### 5. Run the model in ml5js
Copy the folder we got from step 4 and put it into /models.
Change `style = ml5.styleTransfer('models/fuchun', modelLoaded);` to your model file path.
Run the code
```
python -m SimpleHTTPServer

```
Go to `localhost:8000`, you should be able to see the model working!

