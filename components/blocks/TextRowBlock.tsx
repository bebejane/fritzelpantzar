'use client';

import s from './TextRowBlock.module.scss';
import cn from 'classnames';
import Content from '@/components/Content';

export type LayoutProps = { data: TextRowBlockRecord };

export default function TextRowBlock({ data: { leftColumn, rightColumn } }: LayoutProps) {
	return (
		<section className={s.textRow}>
			{leftColumn && (
				<div className={s.left}>
					<div className={cn(s.desc, 'big')}>
						<Content content={leftColumn} />
					</div>
				</div>
			)}
			{rightColumn && (
				<div className={s.right}>
					<div className={cn(s.desc, 'big')}>
						<Content content={rightColumn} />
					</div>
				</div>
			)}
		</section>
	);
}
