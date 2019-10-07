# styleTransfer_spell
Style Transfer example with [ml5.js](http://ml5js.org/), training the model with [Spell.run](https://learn.spell.run/)

#### Demo: [https://yining1023.github.io/styleTransfer_spell/](https://yining1023.github.io/styleTransfer_spell/.)
https://github.com/yining1023/styleTransfer_spell
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
$ curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
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
spell run --mount runs/THE_RUN_NUMBER_OF_YOUR_SETUP_RUN/data:datasets --machine-type k80 --framework tensorflow --apt ffmpeg --pip moviepy --pip scipy==1.1.0 "python style.py --checkpoint-dir ckpt --style images/style/YOUR_STYLE_IMAGE_NAME.jpg --style-weight 1.5e2 --train-path datasets/train2014 --vgg-path datasets/imagenet-vgg-verydeep-19.mat"
  
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
Install Tensorflow 1.14 on your local computer: [How to install Tensorflow](https://www.tensorflow.org/install/pip).
Install Tensorflow 1.14 with `pip`:
```
pip install tensorflow==1.14
```
Verify if you have tensorflow installed:
```
python -c "import tensorflow as tf;"
```

<b>If you have trouble installing tensorflow on your local computer, you can also use Spell to convert the model.</b> You can skip the rest of the Step 4, can go to [step 4.2](#step4-2)

<b>Put the checkpoint files we downloaded from spell into the current directory</b>(Plz don't forget this step :))
```
python scripts/dump_checkpoint_vars.py --output_dir=src/ckpts/YOUR_FOLDER_NAME --checkpoint_file=./YOUR_FOLDER_NAME/fns.ckpt

python scripts/remove_optimizer_variables.py --output_dir=src/ckpts/YOUR_FOLDER_NAME

```

Remember to replace `YOUR_FOLDER_NAME`, the folder that holds all the checkpoint files.
It will create a new folder in `src/ckpts` with 49 items including a manifest.json file.

### <a name="step4-2"></a> 4.2 Converting model to ml5js with Spell
*** If you finished step 4 successfully(installed tensorflow successfully), skip this step.***

If you have trouble installing tensorflow on your computer, you can convert the model using spell's remote machine which has tensorflow installed: `YOUR_PREVIOUS_TRAINING_RUN_NUMBER` is the run number where you trained the model from Step 3, `YOUR_STYLE_MODEL_NAME` can be any string you want.
```
spell run --mount runs/YOUR_PREVIOUS_TRAINING_RUN_NUMBER/ckpt:YOUR_STYLE_MODEL_NAME --machine-type CPU --framework tensorflow==1.13.1 "python scripts/dump_checkpoint_vars.py --output_dir=src/ckpts/YOUR_STYLE_MODEL_NAME --checkpoint_file=./YOUR_STYLE_MODEL_NAME/fns.ckpt"
```
Then copy the output of this run back to your local computer:
```
spell cp runs/YOUR_PREVIOUS_RUN_NUMBER/src/ckpts
```
After this command, you will find a folder named `YOUR_STYLE_MODEL_NAME` in your `fast-style-transfer-deeplearnjs` folder. `YOUR_STYLE_MODEL_NAME` folder shoud have 14p items including a `manifest.json` file.

### 5. Running the model in ml5js
Go to a new directory,
```
git clone git@github.com:yining1023/styleTransfer_spell.git
cd styleTransfer_spell
```
Copy the folder we got from step 4 and put it into /models.
Change `style = ml5.styleTransfer('models/fuchun', modelLoaded);` to your model file path(replace `fuchun` to `YOUR_STYLE_MODEL_NAME`).
Run the code
```
python -m SimpleHTTPServer

```
If you are using python3, run
```
python3 -m http.server
```
Go to `localhost:8000`, you should be able to see the model working!


## Some issues you might have when training the model with spell
- During [step 1](https://github.com/yining1023/styleTransfer_spell#1-preparing-your-environment) preparing your environment, after you add your style image to the `style` folder, you need to commit the changes to git, so the remote spell machine can get access to your changes. 
  ```
  $ git add images ckpt
  $ git commit -m "Added required folders and images"
  ```
- When you are on [step 3](https://github.com/yining1023/styleTransfer_spell#3-training-with-stylepy) Training with style.py, you need to choose a GPU machine type, CPU machine wouldn't work.
  ```
  --machine-type k80
  ```

- On [step 4](https://github.com/yining1023/styleTransfer_spell#4-converting-model-to-ml5js) Converting the model to ml5js, you need to install TensorFlow on your local computer. See more instruction [here](https://www.tensorflow.org/install/pip). Or you can run these commands on Spell, so you don't need to install TensorFlow locally, after you are done, `spell cp` your model back to your local computer.

- Remember to replace things like 'YOUR_RUN_NUMBER', 'YOUR_FOLDER_NAME', 'YOUR_STYLE_IMAGE_NAME' to your own number and names.

