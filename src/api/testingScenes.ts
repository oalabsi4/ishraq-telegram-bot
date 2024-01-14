import { Context, Scenes,  } from 'telegraf';
import { message } from 'telegraf/filters';


interface MySceneSession extends Scenes.SceneSessionData {
    // will be available under `ctx.scene.session.mySceneSessionProp`
    name: string;
    age: number;
    gender: string;
  }

  /**
   * We can define our own context object.
   *
   * We now have to set the scene object under the `scene` property. As we extend
   * the scene session, we need to pass the type in as a type variable.
   */
  interface MyContext extends Context {
    // will be available under `ctx.myContextProp`
    name: string;
    age: number;
    gender: string;

    // declare scene type
    scene: Scenes.SceneContextScene<MyContext, MySceneSession>;
  }
  export  function testScene(getNameScene: Scenes.BaseScene<Scenes.SceneContext>, getAgeScene: Scenes.BaseScene<Scenes.SceneContext>, getGenderScene: Scenes.BaseScene<Scenes.SceneContext>, displayInfoScene: Scenes.BaseScene<Scenes.SceneContext>) {
    const  data: unknown[]= []
  getNameScene.enter(ctx => ctx.reply('Hello type your name please:'));

  getNameScene.on(message('text'), async ctx => {
    if (ctx.message.text && ctx.message.text.length > 2) {
      const name = ctx.message.text;
      await ctx.reply(`Hello ${name}`);

      data.push(ctx.message.text);
      return await ctx.scene.enter('getAge');
    } else {
      await ctx.reply('Name too short');
      await ctx.scene.reenter();
    }
  });

  getAgeScene.enter(ctx => ctx.reply('Hello type your age please:'));
  getAgeScene.on(message('text'), async ctx => {
    if (!ctx.message.text || typeof +ctx.message.text !== 'number' || +ctx.message.text <= 0 || isNaN(+ctx.message.text)) {
      await ctx.reply('please enter a number');
      await ctx.scene.reenter();
    } else {
      const age = +ctx.message.text;
      await ctx.reply(`Hello ${age}`);
      data.push(age);
      await ctx.scene.enter('getGender');
    }
  });

  getGenderScene.enter(
    async ctx =>
      await ctx.reply('choose a gender please:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'male', callback_data: 'male' }],
            [{ text: 'female', callback_data: 'female' }],
            [{ text: 'other', callback_data: 'other' }],
          ],
        },
      })
  );
  getGenderScene.action(['male', 'female', 'other'], async ctx => {
    const selection = ctx.match[0];
    if (!selection) {
      await ctx.reply('something went wrong');
      await ctx.scene.reenter();
    }
    data.push(selection);
    await ctx.reply(`Hello ${selection}`);
    await ctx.scene.enter('displayInfo');
  });
  displayInfoScene.enter(async ctx => {
    await ctx.reply(`Hello ${data}\nis this correct ? `, {
      reply_markup: {
        inline_keyboard: [[{ text: 'yes', callback_data: 'yes' }], [{ text: 'no', callback_data: 'no' }]],
      },
    });
  });
  displayInfoScene.action(['yes', 'no'], async ctx => {
    if (ctx.match[0] === 'yes') {
      await ctx.reply('data saved');
      await ctx.scene.leave();
    } else {
      await ctx.reply('try again');
      await ctx.scene.enter('getName');
    }
  });
}
