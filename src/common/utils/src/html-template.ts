import { Injectable } from '@nestjs/common';
import * as mustache from 'mustache';
import { join } from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class HtmlTemplate {
  async templateFromFile(fileName: string, data: any): Promise<string> {
    const html: Buffer = await readFile(
      join(__dirname, `../public/${fileName}.hbs`),
    );
    return this.template(html.toString(), data);
  }

  template(html: string, data: any): string {
    return mustache.render(html, data);
  }
}
