import { Injectable } from '@nestjs/common';
import * as mustache from 'mustache';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class HtmlTemplate {
  async templateFromFile(fileName: string, data: any): Promise<string> {
    const html: Buffer = await fs.readFile(
      path.join(__dirname, `./templates/${fileName}.hbs`),
    );
    return this.template(html.toString(), data);
  }

  private template(html: string, data: any): string {
    return mustache.render(html, data);
  }
}
